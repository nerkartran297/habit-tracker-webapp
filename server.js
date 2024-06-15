const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');
const path = require('path');
const multer = require('multer');
const { NOMEM } = require('dns');

const app = express();
const port = 3000;

//Connect DATABASE
mongoose.connect('mongodb://localhost:27017/habitTracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

//Create DATABASE
const accountSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    password: { type: String, required: true },
    name: String,
    dob: Date,
    notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }],
    habits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Habit' }],
    introduction: { type: mongoose.Schema.Types.ObjectId, ref: 'Introduction' },
    pinned: { type: mongoose.Schema.Types.ObjectId, ref: 'Pinned' },
    listVideo: [{ type: String, maxlength: 20 }]
});

const noteSchema = new mongoose.Schema({
    ids: [{ type: String }],
    image: { type: String, required: true },
    title: { type: String, required: true },
    date: { type: Date, required: true },
    content: { type: String, required: true }
});

const habitSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: 'Account' },
    name: { type: String, required: true },
    time: { type: String, required: true },
    content: String,
    important: { type: Boolean, default: false }
});

const introductionSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: 'Account' },
    image: { type: String, required: true },
    topic: String,
    content: String
});

const pinnedSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: 'Account' },
    topic: String,
    content: String
});

//Session for DB
app.use(session({
    secret: 'nerkartran',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/habitTracker',
        collectionName: 'sessions'
    })
}));

function authMiddleware(req, res, next) {
    if (!req.session.userId) {
        res.redirect('/login');
    }
    next();
}

const storage = multer.diskStorage({
    destination: "./upload/images/",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
})

const Account = mongoose.model('Account', accountSchema);
const Note = mongoose.model('Note', noteSchema);
const Habit = mongoose.model('Habit', habitSchema);
const Introduction = mongoose.model('Introduction', introductionSchema);
const Pinned = mongoose.model('Pinned', pinnedSchema);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/img', express.static(path.join(__dirname, 'assets/img')));
app.use("/images", express.static("upload/images"));

app.get('/watch', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'watch.html'));
});

app.get('/home', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/habit', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'habit.html'));
});

app.get('/note', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'note.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/setting', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'setting.html'));
});

app.get('/view', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'viewNote.html'));
});

app.get('/edit', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'editNote.html'));
});

app.get('/create', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'createNote.html'));
});

app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingAccount = await Account.findOne({ _id: email });
        if (existingAccount) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const today = new Date();
        const formattedDate = today.toISOString();
        const newAccount = new Account({
            _id: email,
            name: 'none',
            dob: formattedDate,
            password: hashedPassword,
            notes: []
        });

        await newAccount.save();

        // Tạo các object mẫu và liên kết với tài khoản
        const sampleNote = {
            ids: [newAccount._id],
            image: "https://gcs.tripi.vn/public-tripi/tripi-feed/img/474114SoJ/hinh-nen-2k-cho-laptop_014252655.jpg",
            title: "Note mẫu 1",
            date: new Date(),
            content: "Đây là nội dung của ghi chú mẫu."
        };

        const sampleHabit = {
            userId: newAccount._id, // Liên kết habit với ID của tài khoản
            name: "Tập thể dục",
            time: "07:00",
            content: "Chạy bộ 30 phút mỗi sáng."
        };

        const sampleIntroduction = {
            userId: newAccount._id, // Liên kết introduction với ID của tài khoản
            topic: "Lời giới thiệu",
            image: "https://gcs.tripi.vn/public-tripi/tripi-feed/img/474114SoJ/hinh-nen-2k-cho-laptop_014252655.jpg",
            content: "Chào mừng bạn đến với ứng dụng của chúng tôi! Hãy giới thiệu bản thân và chia sẻ những điều bạn yêu thích."
        };

        const samplePinned = {
            userId: newAccount._id, // Liên kết pinned với ID của tài khoản
            topic: "Mục tiêu của tôi",
            content: "Năm nay, tôi muốn hoàn thành khóa học lập trình web và tìm được một công việc tốt."
        };

        const newNoteInstance = await Note.create(sampleNote);
        const newHabitInstance = await Habit.create(sampleHabit);
        const newIntroductionInstance = await Introduction.create(sampleIntroduction);
        const newPinnedInstance = await Pinned.create(samplePinned);

        // Cập nhật tài khoản với ID của các object mẫu
        newAccount.notes = [newNoteInstance._id];
        newAccount.habits = [newHabitInstance._id];
        newAccount.introduction = newIntroductionInstance._id;
        newAccount.pinned = newPinnedInstance._id;

        await newAccount.save();

        req.session.userId = email;
        res.json({ message: 'Registration successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Account.findOne({ _id: email });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        req.session.userId = user._id;
        res.redirect('/home');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Lỗi khi hủy session:', err);
            res.status(500).send('Server Error');
        } else {
            res.redirect('/');
        }
    });
});

app.get('/api/me/introduction', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId; // Lấy ID người dùng từ session
        const introduction = await Introduction.findOne({ userId });

        if (!introduction) {
            return res.status(404).json({ error: 'Introduction not found' });
        }

        res.json(introduction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/me/notes', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;
        const notes = await Note.find({ ids: { $in: [userId] } });
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/notes/:noteId', authMiddleware, async (req, res) => {
    try {
        const noteId = req.params.noteId;
        const userId = req.session.userId; // Lấy ID người dùng từ session

        const note = await Note.findOne({ _id: noteId });

        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        // Kiểm tra quyền truy cập: userId có nằm trong mảng ids của note không
        if (!note.ids.includes(userId)) {
            return res.status(403).json({ error: 'You do not have permission to view this note' });
        }

        res.json(note);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/notes/:noteId', authMiddleware, async (req, res) => {
    try {
        const noteId = req.params.noteId;
        const userId = req.session.userId;

        const note = await Note.findOne({ _id: noteId });

        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        // Kiểm tra quyền xóa (chỉ chủ sở hữu hoặc người có quyền mới được xóa)
        if (!note.ids.includes(userId)) {
            return res.status(403).json({ error: 'You do not have permission to delete this note' });
        }

        // Xóa note khỏi MongoDB
        await Note.deleteOne({ _id: noteId });

        // Xóa note khỏi mảng notes của tài khoản (nếu cần)
        await Account.updateOne(
            { _id: userId },
            { $pull: { notes: noteId } }
        );

        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/api/notes/:noteId', authMiddleware, async (req, res) => {
    try {
        const noteId = req.params.noteId;
        const userId = req.session.userId;
        const { title, date, content, image } = req.body; // Nhận dữ liệu từ form

        const note = await Note.findOne({ _id: noteId });
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        // Kiểm tra quyền chỉnh sửa (chỉ chủ sở hữu hoặc người có quyền mới được chỉnh sửa)
        if (!note.ids.includes(userId)) {
            return res.status(403).json({ error: 'You do not have permission to edit this note' });
        }

        // Cập nhật thông tin note
        note.title = title;
        note.date = new Date(date); // Chuyển đổi chuỗi ngày tháng thành Date object
        note.content = content;
        if (image) { // Nếu có ảnh mới, cập nhật
            note.image = image;
        }

        await note.save();

        res.json({ message: 'Note updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/notes', authMiddleware, async (req, res) => {
    try {
        const { title, date, content, image } = req.body;
        const userId = req.session.userId;

        const newNote = new Note({
            title,
            date: new Date(date),
            content,
            ids: [userId],
            userId,
            image
        });

        await newNote.save();
        res.status(201).json({ message: 'Note created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post("/upload", upload.single("notes"), (req, res) => {
    res.json({
        success: 1,
        image_url: `/images/${req.file.filename}`
    });
});

app.get('/api/me/pinned', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;
        const pinned = await Pinned.findOne({ userId });
        if (!pinned) {
            return res.status(404).json({ error: 'Pinned post not found' });
        }

        res.json(pinned);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/me/habits', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId; // Lấy ID người dùng từ session
        const habits = await Habit.find({ userId }); // Tìm các habit của người dùng

        res.json(habits);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/habits', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;
        const { name, time, content, important } = req.body;
        if (!name || !time) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const newHabit = new Habit({
            userId,
            name,
            time,
            content,
            important,
        });
        await newHabit.save();
        res.json({ message: 'Habit created successfully', habit: newHabit });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/habits/:habitId', authMiddleware, async (req, res) => {
    try {
        const habitId = req.params.habitId;
        const userId = req.session.userId;

        const result = await Habit.deleteOne({ _id: habitId, userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Habit not found or you do not have permission to delete' });
        }

        res.json({ message: 'Habit deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/api/me/pinned', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;
        const { topic, content } = req.body;
        const updateFields = {};

        if (topic !== undefined) {
            updateFields.topic = topic;
        }
        if (content !== undefined) {
            updateFields.content = content;
        }

        const updatedPinned = await Pinned.findOneAndUpdate(
            { userId },
            updateFields,
            { new: true, upsert: true }
        );

        res.json({ message: 'Pinned text updated successfully', pinned: updatedPinned });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/save-video', authMiddleware, async (req, res) => {
    const userId = req.session.userId;
    const videoId = req.body.videoId;

    try {
        const account = await Account.findById(userId);
        if (!account) {
            return res.status(404).json({ error: 'User not found' });
        }

        const existingIndex = account.listVideo.indexOf(videoId);

        if (existingIndex !== -1) {
            account.listVideo.splice(existingIndex, 1);
        }

        account.listVideo.unshift(videoId);
        if (account.listVideo.length > 20) {
            account.listVideo.pop();
        }

        await account.save();
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving video:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/api/me/list-video', authMiddleware, async (req, res) => {
    const userId = req.session.userId;

    try {
        const account = await Account.findById(userId);
        if (!account) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ listVideo: account.listVideo });
    } catch (error) {
        console.error('Error fetching video list:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
