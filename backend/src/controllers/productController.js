const Product = require('../models/Product');
const { formatResource, error, success } = require('../utils/responseHandler');

// 1. Obtener todos (Con Paginación y Búsqueda)
exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const q = req.query.q || '';

    // Validación de query params
    if (limit < 1 || limit > 100) {
      return error(res, 400, "Invalid query parameter", [
        { field: "limit", message: "limit must be between 1 and 100" }
      ]);
    }

    // Filtro de búsqueda
    const filter = {};
    if (q) {
      filter.name = { $regex: q, $options: 'i' };
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Respuesta estandarizada
    success(res, 200, {
      data: products.map(p => formatResource(p)),
      total,
      page,
      limit
    });

  } catch (err) {
    error(res, 500, "Error al obtener productos");
  }
};

// 2. Crear Producto
exports.createProduct = async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    
    // Validación estricta (422)
    if (!name || price === undefined) {
      return error(res, 422, "Validation failed", [
        { field: "name", message: "required" },
        { field: "price", message: "required" }
      ]);
    }

    const newProduct = new Product({ name, price, stock });
    await newProduct.save();
    
    success(res, 201, formatResource(newProduct));
  } catch (err) {
    error(res, 500, "Error al crear producto");
  }
};

// 3. Editar Producto
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updatedProduct) {
      return error(res, 404, "Product not found", { id });
    }
    
    success(res, 200, formatResource(updatedProduct));
  } catch (err) {
    error(res, 500, "Error al actualizar producto");
  }
};

// 4. Eliminar Producto
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    
    if (!deleted) return error(res, 404, "Product not found");

    success(res, 200, { message: 'Product deleted successfully', id });
  } catch (err) {
    error(res, 500, "Error al eliminar producto");
  }
};