const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    size: String,
    color: String,
    stock: Number,
}, { timestamps: true });

module.exports = mongoose.model('Variant', variantSchema);