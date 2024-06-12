const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
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
    image: {
        type: String,
    },
    title: { 
        type: String, 
       
    },
    content: { 
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