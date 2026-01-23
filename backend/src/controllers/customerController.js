const Customer = require('../models/Customer');

// Obtener todos los clientes
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ name: 1 }); // Ordenados A-Z
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
};

// --- CREAR CLIENTE (Con Validación) ---
exports.createCustomer = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // 1. Validaciones de Servidor (Doble seguridad)
    if (!name || !email) {
      return res.status(400).json({ error: 'Nombre y Correo son obligatorios' });
    }

    // 2. Crear Cliente
    const newCustomer = new Customer({
      name,
      email,
      phone, // Si viene vacío, no pasa nada
      purchasesCount: 0
    });

    await newCustomer.save();
    res.status(201).json(newCustomer);

  } catch (error) {
    console.error(error);
    // Si el error es por correo duplicado (código 11000 en Mongo)
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Este correo ya está registrado' });
    }
    res.status(500).json({ error: 'Error al crear cliente' });
  }
};