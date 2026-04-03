const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  variant: { type: mongoose.Schema.Types.ObjectId, ref: 'Variant' },
  quantity: Number,
  price: Number,
}, { timestamps: true });

module.exports = mongoose.model('OrderItem', orderItemSchema);