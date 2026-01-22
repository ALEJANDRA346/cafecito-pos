const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Intenta conectar usando la variable de entorno
    const conn = await mongoose.connect(process.env.DB_CONNECTION_STRING);
    
    console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error conectando a MongoDB: ${error.message}`);
    process.exit(1); // Detiene la app si no hay base de datos
  }
};

module.exports = connectDB;