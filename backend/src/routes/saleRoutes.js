const express = require('express');
const router = express.Router();

// Importamos AMBAS funciones: crear venta y obtener historial
const { createSale, getSales } = require('../controllers/saleController');

// Ruta para cobrar (POST)
router.post('/', createSale);

// Ruta para ver historial (GET) <--- ¡Esta es la nueva!
router.get('/', getSales);

module.exports = router;