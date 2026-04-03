const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: String,
        price: Number,
        description: String,
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoty' },
        brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
        image: [String],
        avgRating: { typr: Number, default: 0 },
    }, { timestampts: true });

module.exports = mongoose.model('Product', productSchema);