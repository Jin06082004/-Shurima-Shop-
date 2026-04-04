const express = require('express');
const router = express.Router();
const productController = require('./product.controller');

// GET /api/products       — list all (with pagination, search, filter, sort)
// POST /api/products      — create new product
router
  .route('/')
  .get(productController.getAllProducts)
  .post(productController.createProduct);

// GET /api/products/:id   — get single product
// PUT /api/products/:id   — update product
// DELETE /api/products/:id — soft-delete product
router
  .route('/:id')
  .get(productController.getProductById)
  .put(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
