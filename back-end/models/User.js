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
    cartData: {
        type: Object,
    },
    orderData: {
        type: Array,
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, {timestamps: true});

const UserModel = mongoose.model('user', UserSchema, "users");
module.exports = UserModel;