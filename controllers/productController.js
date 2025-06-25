const Product = require('../models/Product');
const Category = require('../models/Category');


// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const categoryExists = await Category.exists({categoryId: req.body.categoryId});
        if (!categoryExists) {
            return res.status(400).json({
                success: false,
                error: 'Invalid category: category does not exist'
            });
        }

        const existingProduct = await Product.findOne({name: req.body.name});
        if (existingProduct) {
            return res.status(400).json({
                success: false,
                error: 'Product with this name already exists'
            });
        }

        const product = await Product.create(req.body);

        return res.status(201).json({
            success: true,
            data: product
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate({
            path: 'category',
            select: 'categoryId name description'
        });
        return res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Update an existing product
exports.updateProduct = async (req, res) => {
    const {productId} = req.params;
    const updateData = req.body;

    try {
        if (updateData.categoryId) {
            const categoryExists = await Category.exists({categoryId: updateData.categoryId});
            if (!categoryExists) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid category: category does not exist'
                });
            }
        }

        const product = await Product.findOneAndUpdate(
            {productId},
            updateData,
            {
                new: true,
                runValidators: true,
                lean: true
            }
        );

        if (!product) {
            return res.status(400).json({
                success: false,
                error: 'Product not found'
            });
        }
        return res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    const {productId} = req.params;
    try {
        const product = await Product.findOneAndDelete({productId});

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


exports.searchProducts = async (req, res) => {
    const filters = req.body;
    const searchFilters = {};
    try {
        if (filters.name) {
            searchFilters.name = { $regex: filters.q, $options: 'i' };
        }


        // Filter by category
        if (filters.categoryId) {
            searchFilters.categoryId = filters.categoryId;
        }

        // Filter by price range
        if (filters.minPrice || filters.maxPrice) {
            searchFilters.price = {};
            if (filters.minPrice) searchFilters.price.$gte = Number(filters.minPrice);
            if (filters.maxPrice) searchFilters.price.$lte = Number(filters.maxPrice);
        }

        // Filter by stock availability
        if (filters.inStock !== undefined) {
            searchFilters.inStock = filters.inStock;
        }

        const results = await Product.find(searchFilters).populate({
            path: 'categoryId',
            model: 'Category',
            localField: 'categoryId',
            foreignField: 'categoryId',
            justOne: true
        });
        return res.json({success: true, count: results.length, data: results});
    } catch (err) {
        return res.status(500).json({success: false, error: err.message});
    }
};
