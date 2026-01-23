require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');

// Importar rutas
const productRoutes = require('./src/routes/productRoutes');
const saleRoutes = require('./src/routes/saleRoutes');
const authRoutes = require('./src/routes/authRoutes'); // <--- 1. NUEVO: Importamos la ruta de login

connectDB();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- ZONA DE RUTAS ---
app.get('/', (req, res) => res.send('API Cafecito POS funcionando ☕'));

app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/customers', require('./src/routes/customerRoutes')); // Mantenemos la de clientes
app.use('/api/auth', authRoutes); // <--- 2. NUEVO: Activamos la ruta /api/auth

// ---------------------

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});