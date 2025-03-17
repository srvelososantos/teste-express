const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true,
        default: "processing"
    },
    author:{
        type: String,
        required: true,
        default: "unknown"
    },
    voice:{
        type: String,
        required: true
    },
    progress: {
        type: Number,
        required: true,
        default: 0
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    filePath: {
        type: String,
        required: true 
    }
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;