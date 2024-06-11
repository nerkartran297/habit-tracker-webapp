const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    id: {
        type: String,
        unique: true,
        required: true,
        },
    name: { 
        type: String, 
        required: true 
    },
    detail: { 
        type: String,  
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date,
        default: Date.now 
    },
}, {timestamps: true});

const NoteModel = mongoose.model('note', NoteSchema, "notes");
module.exports = NoteModel;