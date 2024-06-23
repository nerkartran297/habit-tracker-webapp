const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');
const path = require('path');
const multer = require('multer');

const app = express();
const port = 3000;

// mongoose.connect('mongodb://localhost:27017/habitTracker', {})
//     .then(() => console.log('Connected to MongoDB'))
//     .catch(err => console.error('Could not connect to MongoDB', err));

const connectionString = 'mongodb+srv://nerkartran:EKbfSeO960F6xoot@nerkar297.08aesdq.mongodb.net/?retryWrites=true&w=majority&appName=nerkar297';

mongoose.connect(connectionString, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
});
//Note
//Create DATABASE
const accountSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: String,
    phone: String,
    avatar: String,
    email: String,
    password: { type: String, required: true },
    name: String,
    dob: Date,
    notes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note'
    }],
    habits: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Habit'
    }],
    introduction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Introduction'
    },
    pinned: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pinned'
    },
    listVideo: [{
        type: String,
        maxlength: 20
    }],
    todos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Todo'
    }],
    financeIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Finance'
    }]
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
    important: { type: Boolean, default: false },
    daysOfWeek: {
        type: Number,
        default: 127
    }
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

const noteRevisionSchema = new mongoose.Schema({
    noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true },
    userId: [{ type: String }], // Array to store user IDs who edited the note
    title: { type: [String], maxlength: 10 },
    date: { type: [Date], maxlength: 10 },
    content: { type: [String], maxlength: 10 },
    image: { type: [String], maxlength: 10 }
});

const todoSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    content: { type: String, required: true },
    isDone: { type: Boolean, default: false },
    userId: { type: String, required: true } // Lưu userId vào todoSchema
});

const BillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: {
        type: String,
        enum: ['income', 'expense', 'saving', 'extra'],
        required: true
    },
    budget: { type: Number, required: true },
    actual: { type: Number, required: true },
    description: { type: String },
    date: { type: Date, required: true } // Ngày tháng của bill
});

const FinanceSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: 'Account' },
    name: { type: String, required: true },
    incomeBills: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bill'
    }],
    expenseBills: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bill'
    }],
    savingBills: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bill'
    }],
    extraBills: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bill'
    }],
    remainingAmount: { type: Number, default: 0 },
});

//Session for DB
app.use(session({
    secret: 'nerkartran',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://nerkartran:EKbfSeO960F6xoot@nerkar297.08aesdq.mongodb.net/?retryWrites=true&w=majority&appName=nerkar297',
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

const Todo = mongoose.model('Todo', todoSchema);
const Account = mongoose.model('Account', accountSchema);
const Note = mongoose.model('Note', noteSchema);
const Habit = mongoose.model('Habit', habitSchema);
const Introduction = mongoose.model('Introduction', introductionSchema);
const Pinned = mongoose.model('Pinned', pinnedSchema);
const NoteRevision = mongoose.model('NoteRevision', noteRevisionSchema);
const Finance = mongoose.model('Finance', FinanceSchema);
const Bill = mongoose.model('Bill', BillSchema);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/img', express.static(path.join(__dirname, 'assets/img')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use("/images", express.static("upload/images"));


app.get('/watch', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'watch.html'));
});

app.get('/finance', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'finance.html'));
});

app.get('/timer', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'timer.html'));
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

// Register
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

// Log in
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

// Log out
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

// Load introduction
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

// Load notes
app.get('/api/me/notes', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;

        const user = await Account.findById(userId).populate('notes');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user.notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// View notes
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

// Delete notes
app.delete('/api/notes/:noteId', authMiddleware, async (req, res) => {
    try {
        const noteId = req.params.noteId;
        const userId = req.session.userId;

        const note = await Note.findOne({ _id: noteId });

        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        if (!note.ids.includes(userId)) {
            return res.status(403).json({ error: 'You do not have permission to delete this note' });
        }

        await Note.deleteOne({ _id: noteId });

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

// Edit notes
app.put('/api/notes/:noteId', authMiddleware, async (req, res) => {
    try {
        const noteId = req.params.noteId;
        const userId = req.session.userId;
        const { title, date, content, image } = req.body;

        const note = await Note.findOne({ _id: noteId });
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        if (!note.ids.includes(userId)) {
            return res.status(403).json({ error: 'You do not have permission to edit this note' });
        }

        note.title = title;
        note.date = new Date(date);
        note.content = content;
        if (image) {
            note.image = image;
        }

        await note.save();

        await NoteRevision.findOneAndUpdate(
            { noteId },
            {
                $addToSet: { userId },
                $push: {
                    title: { $each: [note.title], $slice: -10 },
                    date: { $each: [note.date], $slice: -10 },
                    content: { $each: [note.content], $slice: -10 },
                    image: { $each: [note.image], $slice: -10 },
                }
            },
            { upsert: true }
        );

        res.json({ message: 'Note updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create new notes
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

        await Account.updateOne(
            { _id: userId },
            { $push: { notes: newNote._id } } // Add the new note's ID
        );

        await newNote.save();
        res.status(201).json({ message: 'Note created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Upload new image for notes
app.post("/upload", upload.single("notes"), (req, res) => {
    res.json({
        success: 1,
        image_url: `/images/${req.file.filename}`
    });
});

// Load habits
app.get('/api/me/habits', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;
        const user = await Account.findById(userId).populate('habits');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        user.habits = user.habits.map(habit => {
            let daysOfWeekFlags = habit.daysOfWeek;
            let activeDays = [];

            for (let i = 0; i < 7; i++) {
                if ((daysOfWeekFlags & (1 << i)) !== 0) {
                    activeDays.push(dayNames[i]);
                }
            }
            habit.daysOfWeek = activeDays;
            return habit;
        });

        res.json(user.habits);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create new habit
app.post('/api/habits', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;
        const { name, time, content, important, daysOfWeek } = req.body;

        if (!name || !time) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        let daysOfWeekFlags = 0;
        if (Array.isArray(daysOfWeek)) {
            daysOfWeek.forEach(day => {
                const dayIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(day);
                if (dayIndex !== -1) {
                    daysOfWeekFlags |= (1 << dayIndex);
                }
            });
        } else if (typeof daysOfWeek === 'number') {
            daysOfWeekFlags = daysOfWeek;
        } else {
            daysOfWeekFlags = 127;
        }

        const newHabit = new Habit({
            userId,
            name,
            time,
            content,
            important,
            daysOfWeek: daysOfWeekFlags,
        });

        await newHabit.save();
        await Account.findByIdAndUpdate(userId, { $push: { habits: newHabit._id } });
        res.json({ message: 'Habit created successfully', habit: newHabit });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Edit habit
app.put('/api/habits/:habitId', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;
        const habitId = req.params.habitId;
        const { name, time, content, important, daysOfWeek } = req.body;

        if (!name || !time) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        let daysOfWeekFlags = daysOfWeek
            ? daysOfWeek.reduce((acc, day) => {
                const dayIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(day);
                return acc | (1 << dayIndex);
            }, 0)
            : undefined;

        const updatedHabit = await Habit.findOneAndUpdate(
            { _id: habitId, userId },
            { name, time, content, important, daysOfWeek: daysOfWeekFlags },
            { new: true }
        );

        if (!updatedHabit) {
            return res.status(404).json({ error: 'Habit not found or you do not have permission to edit' });
        }

        res.json({ message: 'Habit updated successfully', habit: updatedHabit });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete habit
app.delete('/api/habits/:habitId', authMiddleware, async (req, res) => {
    try {
        const habitId = req.params.habitId;
        const userId = req.session.userId;

        // Delete the habit
        const deleteResult = await Habit.deleteOne({ _id: habitId, userId });
        if (deleteResult.deletedCount === 0) {
            return res.status(404).json({ error: 'Habit not found or you do not have permission to delete' });
        }

        // Remove habitId from the user's habits array
        await Account.findByIdAndUpdate(userId, { $pull: { habits: habitId } });

        res.json({ message: 'Habit deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Load pinned
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

// Edit pinned
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

// Save the video ID
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

// Add video
app.post('/add-video', authMiddleware, async (req, res) => {
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

        if (account.listVideo.length >= 20) {
            return res.status(400).json({ error: 'Video list limit reached (20)' });
        }
        account.listVideo.push(videoId);

        await account.save();
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving video:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update list
app.post('/api/me/update-list-video', authMiddleware, async (req, res) => {
    const userId = req.session.userId;
    const newListVideo = req.body.listVideo;

    try {
        if (!Array.isArray(newListVideo)) {
            return res.status(400).json({ error: 'Invalid input. listVideo must be an array.' });
        }

        if (newListVideo.length > 20) {
            return res.status(400).json({ error: 'Video list limit reached (20).' });
        }

        for (const videoId of newListVideo) {
            if (typeof videoId !== 'string' || !videoId.trim()) {
                return res.status(400).json({ error: 'Invalid videoId in the list.' });
            }
        }

        const account = await Account.findById(userId);
        if (!account) {
            return res.status(404).json({ error: 'User not found' });
        }

        account.listVideo = newListVideo;

        await account.save();
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating video list:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Load the list
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

// Create todo
app.post('/api/todos', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;
        const { content } = req.body;
        const newTodo = new Todo({ content, isDone: false, userId: userId });

        await newTodo.save();
        await Account.findByIdAndUpdate(userId, { $push: { todos: newTodo._id } });
        res.json({ message: 'Todo created successfully', todo: newTodo });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all todos
app.get('/api/todos', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;
        const todos = await Todo.find({ userId }).select('content isDone');
        res.json(todos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi khi lấy danh sách todo' });
    }
});

// Edit todo
app.put('/api/todos/:todoId', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;
        const todoId = req.params.todoId;
        const { isDone } = req.body;

        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: todoId, userId },
            { isDone },
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ error: 'Todo not found or you do not have permission to edit' });
        }

        res.json({ message: 'Todo updated successfully', todo: updatedTodo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete todo
app.delete('/api/todos/:todoId', authMiddleware, async (req, res) => {
    try {
        const todoId = req.params.todoId;
        const userId = req.session.userId;

        const deleteResult = await Todo.deleteOne({ _id: todoId, userId });

        if (!deleteResult.deletedCount === 0) {
            return res.status(404).json({ error: 'Todo not found or you do not have permission to delete' });
        }

        await Account.findByIdAndUpdate(userId, { $pull: { todos: todoId } });

        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Latest-video
app.get('/api/me/latest-video', authMiddleware, async (req, res) => {
    const userId = req.session.userId;

    try {
        const account = await Account.findById(userId);
        if (!account || account.listVideo.length === 0) {
            return res.status(404).json({ error: 'No videos watched yet' });
        }

        const latestVideoId = account.listVideo[0]; // Lấy videoId đầu tiên trong list (mới nhất)
        res.json({ latestVideoId });
    } catch (error) {
        console.error('Error fetching latest video:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a video from history
app.delete('/api/me/delete-video', authMiddleware, async (req, res) => {
    const userId = req.session.userId;
    const videoIdToDelete = req.body.videoId;

    try {
        const account = await Account.findById(userId);
        if (!account) {
            return res.status(404).json({ error: 'User not found' });
        }

        const index = account.listVideo.indexOf(videoIdToDelete);
        if (index > -1) {
            account.listVideo.splice(index, 1);
            await account.save();
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting video:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/finances', authMiddleware, async (req, res) => {
    try {
        const account = await Account.findById(req.session.userId).populate({
            path: 'financeIds',
            populate: {
                path: 'incomeBills expenseBills savingBills extraBills'
            }
        });
        res.json(account.financeIds);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET all finances for the user (including details)
app.get('/api/finances', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;
        const account = await Account.findById(userId).populate({
            path: 'financeIds',
            populate: {
                path: 'incomeBills expenseBills savingBills extraBills'
            }
        });
        res.json(account.financeIds);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET a specific finance and calculate totals (assuming ID is in req.params.id)
app.get('/api/finances/:id', authMiddleware, async (req, res) => {
    try {
        const financeId = req.params.id;

        const finance = await Finance.findById(financeId)
            .populate('incomeBills expenseBills savingBills extraBills');

        if (!finance) {
            return res.status(404).json({ error: 'Finance not found' });
        }

        // Check if the user is authorized to access this finance (optional)
        if (finance.userId.toString() !== req.session.userId) {
            return res.status(403).json({ error: 'Unauthorized access' });
        }

        const totals = {
            income: { actual: 0, budget: 0 },
            expense: { actual: 0, budget: 0 },
            saving: { actual: 0, budget: 0 },
            extra: { actual: 0, budget: 0 },
            actualTotal: 0,
            budgetTotal: 0,
        };

        // Calculate totals for each category
        for (const type of ['income', 'expense', 'saving', 'extra']) {
            finance[`${type}Bills`].forEach(bill => {
                totals[type].actual += bill.actual;
                totals[type].budget += bill.budget;
                totals.actualTotal += bill.actual;
                totals.budgetTotal += bill.budget; // Include extra in budget total
            });
        }

        res.json({ finance, totals });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Cập nhật Bill
app.put('/api/finances/:financeId/bills/:billId', authMiddleware, async (req, res) => {
    try {
        const billId = req.params.billId;
        const financeId = req.params.financeId;
        const newBillData = req.body;

        const fin = await Finance.findById(financeId);
        if (!fin) {
            return res.status(404).json({ error: 'Finance not found' });
        }

        const updatedBill = await Bill.findByIdAndUpdate(billId, newBillData, { new: true });

        if (!updatedBill) {
            return res.status(404).json({ error: 'Bill not found' });
        }

        const finance = await Finance.findById(financeId);

        const billType = updatedBill.type + 'Bills';
        const oldBillType = req.body.oldType + 'Bills';

        if (oldBillType !== billType) {
            await Finance.findByIdAndUpdate(financeId, {
                $pull: { [oldBillType]: billId }
            });
        }

        const billIndex = finance[billType].findIndex(id => id.toString() === billId);
        if (billIndex === -1) {
            finance[billType].push(billId);
        } else {
            finance[billType][billIndex] = updatedBill._id;
        }

        await finance.save();

        res.json({ message: 'Bill updated successfully', bill: updatedBill });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update bill' });
    }
});

app.delete('/api/finances/:financeId/bills/:billId', authMiddleware, async (req, res) => {
    try {
        const { financeId, billId } = req.params;

        const deletedBill = await Bill.findByIdAndDelete(billId);
        if (!deletedBill) {
            return res.status(404).json({ error: 'Bill not found' });
        }

        await Finance.findByIdAndUpdate(financeId, {
            $pull: {
                incomeBills: billId,
                expenseBills: billId,
                savingBills: billId,
                extraBills: billId
            }
        });

        res.json({ message: 'Bill deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete bill' });
    }
});

app.post('/api/finances/:financeId/bills', authMiddleware, async (req, res) => {
    try {
        const financeId = req.params.financeId;
        const newBillData = req.body;

        const finance = await Finance.findById(financeId);
        if (!finance) {
            return res.status(404).json({ error: 'Finance not found' });
        }

        const newBill = new Bill(newBillData);
        const savedBill = await newBill.save();

        const billType = newBillData.type + 'Bills';
        finance[billType].push(savedBill._id);
        await finance.save();

        res.json({ message: 'Bill created successfully', bill: savedBill });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create bill' });
    }
});

app.post('/api/finances', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;
        const { name } = req.body;

        const existingFinance = await Finance.findOne({ userId, name });
        if (existingFinance) {
            return res.status(400).json({ error: 'Finance with this name already exists' });
        }

        const newFinance = new Finance({
            userId,
            name,
            incomeBills: [],
            expenseBills: [],
            savingBills: [],
            extraBills: [],
            remainingAmount: 0
        });

        const savedFinance = await newFinance.save();
        const user = await Account.findById(userId);
        if (user) {
            user.financeIds.push(savedFinance._id);
            await user.save();
        } else {
            console.error('User not found:', userId);
            res.status(201).json(savedFinance);
        }
    } catch (error) {
        console.error('Error creating finance:', error);
        res.status(500).json({ error: 'Failed to create finance' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
