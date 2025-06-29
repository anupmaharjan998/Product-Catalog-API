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
const ROLES = require('../utils/roles');
router.use(protect);

router.route('/')
    .post(authorizeRoles(ROLES.ADMIN, ROLES.SELLER), createCategory)
    .get(getAllCategories);

router.route('/:categoryId')
    .put(authorizeRoles(ROLES.ADMIN, ROLES.SELLER), updateCategory)
    .delete(authorizeRoles(ROLES.ADMIN, ROLES.SELLER), deleteCategory);

router.post('/filter', searchCategory);

module.exports = router;
