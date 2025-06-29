const express = require('express');
const router = express.Router();
const {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    searchProducts
} = require('../controllers/productController');
const {protect, authorizeRoles} = require("../middleware/auth");
router.use(protect);
const upload = require('../middleware/upload');
const ROLES = require('../utils/roles');

router.route('/',)
    .post(authorizeRoles(ROLES.ADMIN, ROLES.SELLER), upload.single('image'), createProduct)
    .get(getAllProducts);

router.route('/:productId')
    .put(authorizeRoles(ROLES.ADMIN, ROLES.SELLER), upload.single('image'), updateProduct)
    .delete(authorizeRoles(ROLES.ADMIN, ROLES.SELLER), deleteProduct);

router.post('/filter', searchProducts);

module.exports = router;
