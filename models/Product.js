const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');

const productSchema = new mongoose.Schema({
    productId: {
        type: String,
        default: uuidv4,
        unique: true
    },

    name: {
        type: String,
        required: [true, 'Product name is required'],
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
    categoryId: {
        type: String,
        ref: 'Category',
        required: [true, 'Product category is required']
    },
    inStock: {
        type: Boolean,
        default: true
    },
    stockQuantity: {
        type: Number,
        default: 0,
        min: 0
    },
    image: {
        type: String,
        default: ''
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
