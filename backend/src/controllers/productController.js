const Product = require('../models/Product');

// 1. Obtener todos (Ya lo tenías)
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// 2. Crear Producto (NUEVO)
exports.createProduct = async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ error: 'Nombre y precio son obligatorios' });
    }

    const newProduct = new Product({ name, price, stock });
    await newProduct.save();
    
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

// 3. Editar Producto (NUEVO)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params; // El ID viene en la URL
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

// 4. Eliminar Producto (NUEVO)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};