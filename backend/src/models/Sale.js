const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer', 
    default: null 
  },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    unitPriceSnapshot: Number, // Guardamos el precio al momento de la venta
    lineTotal: Number
  }],
  subtotal: Number,
  discountPercent: Number,
  discountAmount: Number,
  total: Number,
  paymentMethod: { type: String, default: 'cash' }
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);