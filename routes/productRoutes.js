const express = require('express');
const router = express.Router();
const {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    searchProducts
} = require('../controllers/productController');
const {protect} = require("../auth/auth");
router.use(protect);

router.route('/')
    .post(createProduct)
    .get(getAllProducts);

router.route('/:productId')
    .put(updateProduct)
    .delete(deleteProduct);

router.post('/filter', searchProducts);

module.exports = router;
