require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./src/config/database');

// Importamos los modelos (incluyendo el nuevo User)
const Product = require('./src/models/Product');
const Customer = require('./src/models/Customer');
const User = require('./src/models/User'); // <--- NUEVO

const seedData = async () => {
  try {
    // 1. Conectar a la BD
    await connectDB();

    // 2. Borrar datos viejos (Limpiar la casa)
    console.log('🗑️  Borrando datos anteriores...');
    await Product.deleteMany();
    await Customer.deleteMany();
    await User.deleteMany(); // <--- NUEVO: Borramos usuarios viejos

    // 3. Insertar Usuarios de Sistema (Login)
    console.log('👤 Creando usuarios (Admin y Vendedor)...');
    
    // Usamos .create() uno por uno para que se active la encriptación automática
    await User.create({
      username: 'admin',
      password: '123456', // El modelo lo encriptará
      role: 'admin'
    });

    await User.create({
      username: 'vendedor',
      password: '123456',
      role: 'vendor'
    });

    // 4. Insertar Productos de prueba
    console.log('☕ Insertando productos...');
    await Product.insertMany([
      { name: 'Café Americano', price: 40, stock: 100 },
      { name: 'Capuchino', price: 55, stock: 50 },
      { name: 'Latte', price: 55, stock: 50 },
      { name: 'Espresso', price: 35, stock: 80 },
      { name: 'Muffin de Chocolate', price: 45, stock: 20 },
      { name: 'Galleta de Avena', price: 25, stock: 30 }
    ]);

    // 5. Insertar Clientes de prueba
    console.log('👥 Insertando clientes...');
    await Customer.insertMany([
      { name: 'Cliente Nuevo', phoneOrEmail: 'nuevo@test.com', purchasesCount: 0 },
      { name: 'Cliente Frecuente', phoneOrEmail: 'frecuente@test.com', purchasesCount: 5 }, 
      { name: 'Cliente VIP', phoneOrEmail: 'vip@test.com', purchasesCount: 12 } 
    ]);

    console.log('✅ ¡Datos insertados correctamente!');
    process.exit();
  } catch (error) {
    console.error('❌ Error en el seed:', error);
    process.exit(1);
  }
};

seedData();