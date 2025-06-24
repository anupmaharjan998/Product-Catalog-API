const express = require('express');
const router = express.Router();
const {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');


// Create a new category
router.post('/', createCategory);

// Get all categories
router.get('/', getAllCategories);

// Update a category by ID
router.put('/:id', updateCategory);

// Delete a category by ID
router.delete('/:id', deleteCategory);

module.exports = router;
