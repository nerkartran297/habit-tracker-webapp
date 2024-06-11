const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const multer = require("multer");
const User = require('./models/User');
const Note = require('./models/Note');
const uuid = require("uuid");
const app = express();
const cors = require('cors');
const port = 4000;

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

const fetchAdmin = async (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        res.send({
            isAdmin: false,
            errors: "Please authenticate using a valid token",
        });
    }
    else
        try {
            const data = jwt.verify(token, "admin");
            req.user = data.user;
            next();
        } catch (error) {
            res.send({
                isAdmin: false,
                errors: "Please authenticate using a valid token",
            });
        }
}

app.post("/upload", fetchAdmin, upload.single("product"), (req, res) => {
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
        return res
        .status(400)
        .json(
            {
                success: false,
                message: "Email already exists",
            }
        );
    }
    const user = new User(
        {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        }
    );

    await user.save();
    console.log("User Registered Successfully");

}
);

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
        userId: user.id,
        title: req.body.title,
        content: req.body.content,
    });

    await note.save();
    res.json({ success: true });
    console.log('Saved');
});

// Listening to the server
app.listen(port,(error)=>{
    if (!error) {
        console.log("server Running on Port" + port)
    }
    else {
        console.log("Error : "+error)
    }
})