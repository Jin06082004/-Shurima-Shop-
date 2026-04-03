const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  method: { type: String, enum: ['cod', 'momo', 'vnpay'] },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);