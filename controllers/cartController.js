const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.userId;

    try {
        const product = await Product.findOne({productId});
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.stockQuantity < quantity) {
            return res.status(400).json({ message: 'Not enough stock available' });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.equals({productId}));

        if (itemIndex > -1) {
            const newQty = cart.items[itemIndex].quantity + quantity;

            if (newQty > product.stockQuantity) {
                return res.status(400).json({ message: 'Total quantity exceeds stock' });
            }

            cart.items[itemIndex].quantity = newQty;
        } else {
            cart.items.push({ productId, quantity });
        }

        await cart.save();
        res.status(200).json({ message: 'Product added to cart', cart });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.userId });
        if (!cart || cart.items.length === 0) return res.json({ items: [] });

        // 1. Get all product IDs from cart
        const productIds = cart.items.map(item => item.productId);

        // 2. Fetch all products in one query
        const products = await Product.find({ productId: { $in: productIds } });

        // 3. Create a map for fast lookup
        const productMap = {};
        products.forEach(p => {
            productMap[p.productId] = p;
        });

        // 4. Merge product data into cart items
        const detailedItems = cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            productDetails: productMap[item.productId] || null
        }));

        res.json({ ...cart.toObject(), items: detailedItems });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.removeItem = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.userId;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.productId === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        cart.items.splice(itemIndex, 1);

        await cart.save();

        res.status(200).json({ message: 'Item removed from cart', cart });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to remove item from cart' });
    }
};


exports.updateItemQuantity = async (req, res) => {
    const { productId } = req.params;
    const { action } = req.body;
    const userId = req.user.userId;

    if (!['increase', 'decrease'].includes(action)) {
        return res.status(400).json({ message: 'Invalid action' });
    }

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.productId === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        const item = cart.items[itemIndex];

        const product = await Product.findOne({ productId });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (action === 'increase') {
            if (item.quantity + 1 > product.stock) {
                return res.status(400).json({ message: 'Not enough stock available' });
            }
            item.quantity += 1;
        }

        if (action === 'decrease') {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                return res.status(400).json({ message: 'Quantity cannot be less than 1' });
            }
        }

        await cart.save();
        res.status(200).json({ message: `Item ${action}d successfully`, cart });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};