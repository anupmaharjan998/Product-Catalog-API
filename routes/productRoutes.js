const express = require('express');
const router = express.Router();
const {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');


router.route('/')
    .post(createProduct)
    .get(getAllProducts);

router.route('/:productId')
    .put(updateProduct)
    .delete(deleteProduct);

module.exports = router;
