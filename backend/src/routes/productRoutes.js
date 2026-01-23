const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Rutas Públicas (o protegidas, según queramos luego)
router.get('/', productController.getProducts);

// Rutas de Admin
router.post('/', productController.createProduct);      // Crear
router.put('/:id', productController.updateProduct);    // Editar (necesita ID)
router.delete('/:id', productController.deleteProduct); // Borrar (necesita ID)

module.exports = router;