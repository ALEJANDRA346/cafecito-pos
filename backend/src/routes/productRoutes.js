const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Definir la ruta GET / (que será /api/products)
router.get('/', productController.getProducts);

module.exports = router;