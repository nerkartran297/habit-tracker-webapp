const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    description: {
        type: String,
        default: "I am a new user",
    },
    habits: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Habit',
        },
    ],
    notes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Note',
        },
    ],
}, {timestamps: true});

const UserModel = mongoose.model('user', UserSchema, "users");
module.exports = UserModel;