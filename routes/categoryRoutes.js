const express = require('express');
const router = express.Router();
const {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
    searchCategory
} = require('../controllers/categoryController');
const { protect, authorizeRoles } = require('../middleware/auth');
router.use(protect);

router.route('/')
    .post(authorizeRoles('admin', 'seller'), createCategory)
    .get(getAllCategories);

router.route('/:categoryId')
    .put(authorizeRoles('admin', 'seller'), updateCategory)
    .delete(authorizeRoles('admin', 'seller'), deleteCategory);

router.post('/filter', searchCategory);

module.exports = router;
