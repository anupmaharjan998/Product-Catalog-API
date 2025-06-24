const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');

const categorySchema = new mongoose.Schema({
    categoryId: {
        type: String,
        default: uuidv4,
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);
