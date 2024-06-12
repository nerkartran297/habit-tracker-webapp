const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const multer = require("multer");
const User = require('./models/User');
const Note = require('./models/Note');
const Habit = require('./models/Habit');
const uuid = require("uuid");
const app = express();
const cors = require('cors');
const port = 4000;
const path = require("path");

app.use(express.json());
app.use(cors());

// UID Generation
function generateID() {
    return uuid.v4();
}

// Database connection with MongoDB
MongoDB_URI = "mongodb://localhost:27017/NotesApp";
mongoose.connect(MongoDB_URI);

// API Creation
app.get('/', (req, res) => {
    res.send("Hello from the server");
});

// Image Storage Engine
const storage = multer.diskStorage({
    destination: "./upload/images/",
    filename:(req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
})

// Creating Upload Endpoint for images
app.use("/images", express.static("upload/images"));


// Creating middleware for user authentication
const fetchUser = async (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        res.status(401).send({
            errors: "Please authenticate using a valid token",
        });
    }
    else
        try {
            const data = jwt.verify(token, "secret_ecom");
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({
                errors: "Please authenticate using a valid token",
            });
        }
}
// Creating Endpoint for uploading images
app.post("/upload", upload.single("notes"), (req, res) => {
    res.json({
        success: 1,
        image_url: `/images/${req.file.filename}`
    });
});



// Creating Endpoint for registering a user
app.post('/signup', async (req, res) => {
    let check = await User.findOne({ email: req.body.email });

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    if (check) {
        return res.status(400).json({
            success: false,
            message: "Email already exists",
        });
    }
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        notes: [],
        habits: [],
    });
    const note1 = new Note({
        userId: user._id,
        id: generateID(),
        title: "Welcome to Notes App",
        content: "This is your first note",
    });
    user.notes.push(note1._id);
    await note1.save();

    const habit1 = new Habit({
        userId: user._id,
        id: generateID(),
        name: "Welcome to Notes App",
        detail: "This is your first habit",
    });
    user.habits.push(habit1._id);
    await habit1.save();

    await user.save();
    console.log("User Registered Successfully");
    res.json({ success: true, user });
});

// Creating endpoint for user/admin login
app.post('/login',async (req,res)=>{
    let user = await User.findOne({email:req.body.email});
    if (user) {
        const passCompare = await bcrypt.compare(req.body.password, user.password);
        if (passCompare) {
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else {
            res.json({success:false,errors:"Wrong Password"});
        }
    }
    else {
        res.json({success:false,errors:"Wrong Email Id"})
    }

})



// Creating endpoint for user profile
app.post('/getdescription', fetchUser,async(req,res)=>{
    let user = await User.findOne({_id:req.user.id});
    res.json(user);
  })


// Creating endpoint for creating a note
app.post('/createnote', fetchUser, async (req, res) => {
    let user = await User.findOne({_id:req.user.id});
    const note = new Note({
        id: generateID(),
        userId: user._id,
        title: req.body.title,
        image: req.body.image,
        createdAt: req.body.createdAt,
        content: req.body.content,
    });
    user.notes.push(note._id);
    await note.save();
    await user.save();

    res.json({ success: true });
    console.log('Saved');
});

// Creating endpoint for getting all notes
app.get('/getnotes', fetchUser, async (req, res) => {
    try {
        // Tìm tất cả các ghi chú có userId tương ứng
        const notes = await Note.find({ userId: req.user.id });

        // Trả về danh sách các ghi chú
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Creating endpoint for getting a single note
app.post('/getnote',fetchUser,async(req,res)=>{
    try {
        const user = await User.findOne({_id:req.user.id});
        const note = await Note.findById({userId:user._id,id:req.body.id});
        res.json(note);
        
      } catch (error) {
        throw new Error(`Lỗi khi lấy ghi chú: ${error.message}`);
      }
})

// Creating endpoint for updating a note
app.post('/updatenote',fetchUser,async(req,res)=>{
    let note = await Note.findOne({id:req.body.id});
    note.title = req.body.title;
    note.content = req.body.content;
    await note.save();
    res.json({success:true});
})

// Creating endpoint for deleting a note
app.post('/deletenote',fetchUser,async(req,res)=>{
    let note = await Note.findOne({id:req.body.id});
    let user = await User.findOne({_id:req.user.id});
    user.notes = user.notes.filter((noteid)=>noteid!=note.id);
    await user.save();
    await note.remove();
    res.json({success:true});
})

// Creating endpoint for creating a habit
app.post('/createhabit',fetchUser,async(req,res)=>{
    let user = await User.findOne({_id:req.user.id});
    user.habits.push(req.body.habit);
    await user.save();
    res.json({success:true});
})

// Creating endpoint for getting all habits
app.get('/gethabits',fetchUser,async(req,res)=>{
    let user = await User.findOne({_id:req.user.id});
    res.json(user.habits);
})

// Creating endpoint for deleting a habit
app.post('/deletehabit',fetchUser,async(req,res)=>{
    let user = await User.findOne({_id:req.user.id});
    user.habits = user.habits.filter((habit)=>habit!=req.body.habit);
    await user.save();
    res.json({success:true});
})

// Creating endpoint for updating a habit
app.post('/updatehabit',fetchUser,async(req,res)=>{
    let user = await User.findOne({_id:req.user.id});
    user.habits = user.habits.map((habit)=>{
        if(habit==req.body.oldhabit){
            return req.body.newhabit;
        }
        return habit;
    })
    await user.save();
    res.json({success:true});
})



// Listening to the server
app.listen(port,(error)=>{
    if (!error) {
        console.log("server Running on Port" + port)
    }
    else {
        console.log("Error : "+error)
    }
})