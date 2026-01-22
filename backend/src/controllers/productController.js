const Product = require('../models/Product');

// Obtener todos los productos
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find(); // Busca todo en MongoDB
    res.json(products); // Lo envía como JSON
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};