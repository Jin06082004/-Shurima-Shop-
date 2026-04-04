const express = require('express');
const router = express.Router();
const reviewController = require('./review.controller');

router.post('/', reviewController.create);
router.get('/', reviewController.getAll);
router.get('/:id', reviewController.getById);
router.get('/product/:productId', reviewController.getByProduct);
router.get('/user/:userId', reviewController.getByUser);
router.put('/:id', reviewController.update);
router.delete('/:id', reviewController.delete);

module.exports = router;
