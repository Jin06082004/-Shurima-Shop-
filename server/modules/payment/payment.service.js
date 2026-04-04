const Payment = require('./payment.model');

module.exports = {
    CreatePayment: async function (orderId, method) {
        let newPayment = new Payment({ order: orderId, method });
        return await newPayment.save();
    },
    GetAllPayments: async function () {
        return await Payment.find().populate('order');
    },
    GetPaymentById: async function (id) {
        return await Payment.findById(id).populate('order');
    },
    GetPaymentByOrder: async function (orderId) {
        return await Payment.findOne({ order: orderId });
    },
    UpdatePaymentStatus: async function (id, status) {
        return await Payment.findByIdAndUpdate(id, { status }, { new: true });
    },
    UpdateStatusByOrderId: async function (orderId, status) {
        return await Payment.findOneAndUpdate({ order: orderId }, { status }, { new: true });
    }
};
