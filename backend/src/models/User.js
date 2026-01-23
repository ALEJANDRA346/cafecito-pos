const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['admin', 'vendedor', 'user'], 
    default: 'vendedor' 
  }
});

// --- CORRECCIÓN AQUÍ ---
// Quitamos 'next' de los parámetros.
// Al ser 'async', Mongoose sabe que cuando la función termine, puede seguir.
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return; // Solo retornamos vacío
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);