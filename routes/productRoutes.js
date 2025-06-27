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

router.route('/',)
    .post(authorizeRoles('admin', 'seller'), upload.single('image'), createProduct)
    .get(getAllProducts);

router.route('/:productId')
    .put(authorizeRoles('admin', 'seller'), upload.single('image'), updateProduct)
    .delete(authorizeRoles('admin', 'seller'), deleteProduct);

router.post('/filter', searchProducts);

module.exports = router;
