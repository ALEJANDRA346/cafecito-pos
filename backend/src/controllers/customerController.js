const Customer = require('../models/Customer');
const { formatResource, error, success } = require('../utils/responseHandler');

// Obtener clientes (Con búsqueda y paginación)
exports.getCustomers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const q = req.query.q || '';

    const filter = {};
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } }
      ];
    }

    const total = await Customer.countDocuments(filter);
    const customers = await Customer.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    success(res, 200, {
      data: customers.map(c => formatResource(c)),
      total,
      page,
      limit
    });
  } catch (err) {
    error(res, 500, "Error al obtener clientes");
  }
};

// Crear Cliente
exports.createCustomer = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || (!email && !phone)) {
      return error(res, 422, "Validation failed", [
        { field: "name", message: "required" },
        { field: "email", message: "email or phone required" }
      ]);
    }

    const newCustomer = new Customer({
      name,
      email,
      phone,
      purchasesCount: 0
    });

    await newCustomer.save();
    success(res, 201, formatResource(newCustomer));

  } catch (err) {
    if (err.code === 11000) {
      return error(res, 422, "Validation failed", [
         { field: "email", message: "Email already exists" }
      ]);
    }
    error(res, 500, "Error al crear cliente");
  }
};