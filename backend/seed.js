require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./src/config/database');
const Product = require('./src/models/Product');
const Customer = require('./src/models/Customer');

const seedData = async () => {
  try {
    // 1. Conectar a la BD
    await connectDB();

    // 2. Borrar datos viejos (Limpiar la casa)
    console.log('🗑️  Borrando datos anteriores...');
    await Product.deleteMany();
    await Customer.deleteMany();

    // 3. Insertar Productos de prueba
    console.log('☕ Insertando productos...');
    await Product.insertMany([
      { name: 'Café Americano', price: 40, stock: 100 },
      { name: 'Capuchino', price: 55, stock: 50 },
      { name: 'Latte', price: 55, stock: 50 },
      { name: 'Espresso', price: 35, stock: 80 },
      { name: 'Muffin de Chocolate', price: 45, stock: 20 },
      { name: 'Galleta de Avena', price: 25, stock: 30 }
    ]);

    // 4. Insertar Clientes de prueba
    console.log('👥 Insertando clientes...');
    await Customer.insertMany([
      { name: 'Cliente Nuevo', phoneOrEmail: 'nuevo@test.com', purchasesCount: 0 },
      { name: 'Cliente Frecuente', phoneOrEmail: 'frecuente@test.com', purchasesCount: 5 }, // Tendrá 10% desc
      { name: 'Cliente VIP', phoneOrEmail: 'vip@test.com', purchasesCount: 12 } // Tendrá 15% desc
    ]);

    console.log('✅ ¡Datos insertados correctamente!');
    process.exit();
  } catch (error) {
    console.error('❌ Error en el seed:', error);
    process.exit(1);
  }
};

seedData();