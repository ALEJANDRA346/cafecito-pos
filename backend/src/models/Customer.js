const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, // ¡Ahora es obligatorio!
    unique: true    // No queremos correos repetidos
  },
  phone: { 
    type: String, 
    required: false // Este sí es opcional
  },
  purchasesCount: { 
    type: Number, 
    default: 0 
  }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);