const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  variant: { type: mongoose.Schema.Types.ObjectId, ref: 'Variant' },
  quantity: Number,
}, { timestamps: true });

module.exports = mongoose.model('CartItem', cartItemSchema);