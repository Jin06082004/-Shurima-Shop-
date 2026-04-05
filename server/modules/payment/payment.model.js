const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  method: { type: String, enum: ['cod', 'momo', 'vnpay'], required: true },
  status: { type: String, enum: ['pending', 'paid', 'failed', 'cancelled'], default: 'pending' },
  requestId: { type: String, default: null },
  providerOrderId: { type: String, default: null },
  providerTxnId: { type: String, default: null },
  payUrl: { type: String, default: null },
  deeplink: { type: String, default: null },
  qrCodeUrl: { type: String, default: null },
  rawProviderResponse: { type: Object, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);