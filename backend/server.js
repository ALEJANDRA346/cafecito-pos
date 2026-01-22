require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');
const productRoutes = require('./src/routes/productRoutes'); // <--- 1. IMPORTAR
const saleRoutes = require('./src/routes/saleRoutes');

connectDB();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/api/customers', require('./src/routes/customerRoutes'));

// --- ZONA DE RUTAS ---
app.get('/', (req, res) => res.send('API Cafecito POS funcionando ☕'));
app.use('/api/products', productRoutes); // <--- 2. USAR LA RUTA
app.use('/api/sales', saleRoutes);
// ---------------------

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});