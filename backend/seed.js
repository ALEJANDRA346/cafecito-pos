require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./src/models/Product');
const Customer = require('./src/models/Customer');
const User = require('./src/models/User');

mongoose.connect(process.env.DB_CONNECTION_STRING)
  .then(() => console.log('✅ MongoDB Conectado'))
  .catch(err => console.log(err));

const seedDB = async () => {
  try {
    // 1. Limpiar datos viejos y eliminar índices corruptos
    console.log('🗑️  Borrando datos anteriores...');
    await Product.deleteMany({});
    await User.deleteMany({});

    // BORRADO NUCLEAR: Borramos la colección entera de clientes
    // Esto elimina el índice fantasma "phoneOrEmail" que te da el error
    try {
      await Customer.collection.drop();
    } catch (e) {
      // Ignoramos error si la colección no existía aún
    }

    // 2. Crear Usuarios
    console.log('👤 Creando usuarios...');
    const admin = new User({ username: 'admin', password: '123456', role: 'admin' });
    const vendedor = new User({ username: 'vendedor', password: '123456', role: 'vendedor' });
    await admin.save();
    await vendedor.save();

    // 3. Crear Productos
    console.log('☕ Insertando productos...');
    const products = [
      { name: 'Café Americano', price: 35, stock: 100 },
      { name: 'Cappuccino', price: 45, stock: 50 },
      { name: 'Latte', price: 45, stock: 50 },
      { name: 'Espresso Doble', price: 30, stock: 80 },
      { name: 'Muffin de Chocolate', price: 25, stock: 20 },
      { name: 'Bagel con Queso', price: 40, stock: 15 }
    ];
    await Product.insertMany(products);

    // 4. Crear Clientes (Ahora sí entrarán limpios)
    console.log('👥 Insertando clientes...');
    const customers = [
      { 
        name: 'Cliente Nuevo', 
        email: 'nuevo@test.com', 
        phone: '555-0001', 
        purchasesCount: 0 
      },
      { 
        name: 'Cliente Plata', 
        email: 'plata@test.com', 
        phone: '555-0002', 
        purchasesCount: 2 
      },
      { 
        name: 'Cliente Oro', 
        email: 'oro@test.com', 
        phone: '555-0003', 
        purchasesCount: 5 
      },
      { 
        name: 'Cliente VIP', 
        email: 'vip@test.com', 
        phone: '555-0004', 
        purchasesCount: 12 
      }
    ];
    await Customer.insertMany(customers);

    console.log('✨ ¡Base de datos poblada con éxito!');
    process.exit();
  } catch (error) {
    console.error('❌ Error en el seed:', error);
    process.exit(1);
  }
};

seedDB();