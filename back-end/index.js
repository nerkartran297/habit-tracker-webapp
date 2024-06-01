const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const multer = require("multer");
const User = require('./models/User');
const uuid = require("uuid");
const app = express();

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
    let cart = {};
    let order = [];
    cart["0"] = 0;
    order.push("0");
    const user = new User(
        {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            cartData: cart,
            orderData: order,
        }
    );

    await user.save();

    const data = {
        user:{
            id: user.id,
        }
    }

    const token = jwt.sign(data, "secret_ecom");
    let message = await Message.findOne({ user_id: user.id });
    
            if (!message) {
                message = new Message({ user_id: user.id, messages: [] });
                await message.save();
            }
    res.json(
        {
            success: true,
            token: token,
        }
    );
}
);

// Creating endpoint for user/admin login
app.post('/login', async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) 
    {
        // Dùng bcrypt để so sánh password
        const passCompare = await bcrypt.compare(req.body.password, user.password);
        if (passCompare) 
        {
            const data = {
                user:{
                    id: user.id,
                }
            }
            const token = req.body.email === 'admin'?jwt.sign(data, "admin"):jwt.sign(data, "secret_ecom");
            let message = await Message.findOne({ user_id: user.id });
    
            if (!message) {
                message = new Message({ user_id: user.id, messages: [] });
                await message.save();
            }
            req.body.email === 'admin' ?res.json(
                {
                    success: true,
                    token: token,
                    admin: true,
                }
            ):
            res.json(
                {
                    success: true,
                    token: token,
                    admin: false,
                }
            )
            ;
        }
        else
        {
            res.json(
                {
                    success: false,
                    message: "Invalid Password",
                }
            );
        }
    }
    else
    {
        res.json(
            {
                success: false,
                message: "User not found",
            }
        );
    }
        
});

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


// Listening to the server
server.listen(port, (err) => {
    if (err) {
        console.log("Error in connecting to the server");
    } else {
        console.log("Server is running on port: " + port);
    }
});
