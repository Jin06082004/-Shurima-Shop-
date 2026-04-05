const express = require('express');
const router = express.Router();
const paymentController = require('./payment.controller');
const { verifyToken, isAdmin } = require('../../middlewares/auth.middleware');

router.post('/', verifyToken, paymentController.create);
router.get('/', verifyToken, isAdmin, paymentController.getAll);
// Specific routes must come before /:id
router.get('/order/:orderId', verifyToken, paymentController.getByOrderId);
router.get('/:id', verifyToken, paymentController.getById);
router.put('/order/:orderId', verifyToken, isAdmin, paymentController.updateStatusByOrder);
router.patch('/order/:orderId', verifyToken, isAdmin, paymentController.updateStatusByOrder);
router.put('/:id', verifyToken, isAdmin, paymentController.updateStatus);
router.patch('/:id', verifyToken, isAdmin, paymentController.updateStatus);

module.exports = router;
