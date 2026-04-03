const express = require('express');
const router = express.Router();
const paymentController = require('./payment.controller');

router.post('/', paymentController.create);
router.get('/', paymentController.getAll);
router.get('/:id', paymentController.getById);
router.get('/order/:orderId', paymentController.getByOrderId);
router.put('/:id', paymentController.updateStatus);
router.patch('/:id', paymentController.updateStatus);
router.put('/order/:orderId', paymentController.updateStatusByOrder);
router.patch('/order/:orderId', paymentController.updateStatusByOrder);

module.exports = router;
