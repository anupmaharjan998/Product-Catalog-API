const express = require('express');
const router = express.Router();
const {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    searchProducts
} = require('../controllers/productController');
const {protect} = require("../middleware/auth");
router.use(protect);
const upload = require('../middleware/upload');

router.route('/',)
    .post(upload.single('image'), createProduct)
    .get(getAllProducts);

router.route('/:productId')
    .put(upload.single('image'), updateProduct)
    .delete(deleteProduct);

router.post('/filter', searchProducts);

module.exports = router;
