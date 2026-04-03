const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    auth: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth' },
    name: String,
    phone: String,
    address: String,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);