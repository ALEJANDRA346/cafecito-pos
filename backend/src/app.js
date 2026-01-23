import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // npm install cors
import { connectDB } from './config/database.js';

// Importar rutas
import productRoutes from './routes/productRoutes.js';
import salesRoutes from './routes/salesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';

// Configuración inicial
dotenv.config();
connectDB(); // Conectar a MongoDB

const app = express();

// Middlewares
app.use(cors()); // Permite que el Frontend (React) hable con el Backend
app.use(express.json()); // Permite recibir JSON en los POST

// Definición de Rutas (Endpoints)
app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);

// Ruta de prueba base
app.get('/', (req, res) => {
  res.send('API Cafecito Feliz is running...');
});

// Manejo de puerto
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en modo ${process.env.NODE_ENV} en el puerto ${PORT}`);
});