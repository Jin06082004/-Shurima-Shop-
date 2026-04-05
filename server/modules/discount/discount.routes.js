const express = require('express');

const router = express.Router();

const {
  getDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  validateByCode,
  applyToOrder,
} = require('./discount.controller');

const {
  validateCreateDiscountBody,
  validateUpdateDiscountBody,
  validateApplyDiscountBody,
} = require('./discount.validation');

const { verifyToken, isAdmin } = require('../../middlewares/auth.middleware');

router.get('/check/:code', validateByCode);
router.post('/apply', verifyToken, validateApplyDiscountBody, applyToOrder);

router.get('/', verifyToken, isAdmin, getDiscounts);
router.get('/:id', verifyToken, isAdmin, getDiscountById);
router.post('/', verifyToken, isAdmin, validateCreateDiscountBody, createDiscount);
router.put('/:id', verifyToken, isAdmin, validateUpdateDiscountBody, updateDiscount);
router.delete('/:id', verifyToken, isAdmin, deleteDiscount);

module.exports = router;
