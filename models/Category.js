const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    }},
    {
    timestamp: true
});

module.exports = mongoose.model('Category', categorySchema);