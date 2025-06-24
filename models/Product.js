const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
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
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price must be non-negative']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    inStock: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);