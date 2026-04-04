const express = require('express');
const router = express.Router();
const userController = require('./user.controller');

// CRUD endpoints mapping to Express controller
router.post('/', userController.create);
router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.put('/:id', userController.update); // You can also use patch
router.delete('/:id', userController.delete);

module.exports = router;
