const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true // No puede haber dos usuarios con el mismo nombre
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'vendor'], // Solo permitimos estos dos roles
    default: 'vendor'
  }
}, {
  timestamps: true // Guarda la fecha de creación automáticamente
});

// --- MAGIA DE SEGURIDAD 🔒 ---

// 1. Antes de guardar, encriptar la contraseña
userSchema.pre('save', async function (next) {
  // Si la contraseña no se modificó, no hacemos nada
  if (!this.isModified('password')) {
    next();
  }
  
  // Generamos una "sal" (código aleatorio) y encriptamos
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 2. Método para comparar contraseñas (usado al hacer Login)
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);