const paymentService = require('./payment.service');
const { createPaymentSchema, updatePaymentStatusSchema } = require('./payment.validation');

module.exports = {
    // POST /payment
    create: async (req, res) => {
        try {
            const { error } = createPaymentSchema.validate(req.body);
            if (error) return res.status(400).json({ status: 'error', message: error.details[0].message });

            const { orderId, method } = req.body;
            const newPayment = await paymentService.CreatePayment(orderId, method, req.user);
            res.status(201).json({ status: 'success', data: newPayment });
        } catch (error) {
            res.status(error.statusCode || 500).json({ status: 'error', message: error.message });
        }
    },

    // GET /payment
    getAll: async (req, res) => {
        try {
            const payments = await paymentService.GetAllPayments();
            res.status(200).json({ status: 'success', data: payments });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    // GET /payment/:id
    getById: async (req, res) => {
        try {
            const payment = await paymentService.GetPaymentById(req.params.id, req.user);
            if (!payment) return res.status(404).json({ status: 'error', message: 'Payment not found' });
            res.status(200).json({ status: 'success', data: payment });
        } catch (error) {
            res.status(error.statusCode || 500).json({ status: 'error', message: error.message });
        }
    },

    // GET /payment/order/:orderId
    getByOrderId: async (req, res) => {
        try {
            const payment = await paymentService.GetPaymentByOrder(req.params.orderId, req.user);
            if (!payment) return res.status(404).json({ status: 'error', message: 'Payment not found for this order' });
            res.status(200).json({ status: 'success', data: payment });
        } catch (error) {
            res.status(error.statusCode || 500).json({ status: 'error', message: error.message });
        }
    },

    // PUT|PATCH /payment/:id
    updateStatus: async (req, res) => {
        try {
            const { error } = updatePaymentStatusSchema.validate(req.body);
            if (error) return res.status(400).json({ status: 'error', message: error.details[0].message });

            const updatedPayment = await paymentService.UpdatePaymentStatus(req.params.id, req.body.status);
            if (!updatedPayment) return res.status(404).json({ status: 'error', message: 'Payment not found' });
            res.status(200).json({ status: 'success', data: updatedPayment });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    // PUT|PATCH /payment/order/:orderId
    updateStatusByOrder: async (req, res) => {
        try {
            const { error } = updatePaymentStatusSchema.validate(req.body);
            if (error) return res.status(400).json({ status: 'error', message: error.details[0].message });

            const updatedPayment = await paymentService.UpdateStatusByOrderId(req.params.orderId, req.body.status);
            if (!updatedPayment) return res.status(404).json({ status: 'error', message: 'Payment not found for this order' });
            res.status(200).json({ status: 'success', data: updatedPayment });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
};
