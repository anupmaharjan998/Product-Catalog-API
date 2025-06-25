const Category = require('../models/Category');
require("../models/Product");
// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        return res.status(201).json({
            success: true,
            data: category
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Update an existing category
exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            {
                new: true,
                runValidators: true
            }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'Category not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'Category not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


exports.searchCategory = async (req, res) => {
    const filters = req.body;
    const searchFilters = {};
    try {
        if (filters.name) {
            searchFilters.name = { $regex: filters.name, $options: 'i' };
        }

        const results = await Category.find(searchFilters);

        return res.json({success: true, count: results.length, data: results});
    } catch (err) {
        return res.status(500).json({success: false, error: err.message});
    }
};