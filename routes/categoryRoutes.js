const express = require('express');
const router = express.Router();
const {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
    searchCategory
} = require('../controllers/categoryController');
const { protect } = require('../auth/auth');
router.use(protect);

router.route('/')
    .post(createCategory)
    .get(getAllCategories);

router.route('/:categoryId')
    .put(updateCategory)
    .delete(deleteCategory);

router.post('/filter', searchCategory);

module.exports = router;
