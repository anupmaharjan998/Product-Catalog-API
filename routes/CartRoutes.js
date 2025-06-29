const express = require('express');
const router = express.Router();
const {
    addToCart,
    getCart,
    updateItemQuantity,
    removeItem
} = require('../controllers/CartController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/add', addToCart);
router.get('/', getCart);
router.put('/quantity/:productId', updateItemQuantity);
router.delete('/remove/:productId', removeItem);

module.exports = router;