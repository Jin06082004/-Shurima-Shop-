const express = require('express');
const router = express.Router();
const reviewController = require('./review.controller');
const { verifyToken } = require('../../middlewares/auth.middleware');

router.post('/', verifyToken, reviewController.create);
router.get('/', reviewController.getAll);
// Specific routes must come before /:id to avoid Express matching them as an id
router.get('/product/:productId', reviewController.getByProduct);
router.get('/user/:userId', reviewController.getByUser);
router.get('/:id', reviewController.getById);
router.put('/:id', verifyToken, reviewController.update);
router.delete('/:id', verifyToken, reviewController.delete);

module.exports = router;
