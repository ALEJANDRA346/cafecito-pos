const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  phoneOrEmail: { 
    type: String, 
    required: true, 
    unique: true 
  },
  purchasesCount: { 
    type: Number, 
    default: 0 
  }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);