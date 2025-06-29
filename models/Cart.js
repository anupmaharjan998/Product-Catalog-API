const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: 'String',
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    }
});

const cartSchema = new mongoose.Schema({
    userId: {
        type: 'String',
        ref: 'User',
        required: true,
        unique: true
    },
    items: [cartItemSchema]
});

module.exports = mongoose.model('Cart', cartSchema);