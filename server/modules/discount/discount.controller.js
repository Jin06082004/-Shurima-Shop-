const mongoose = require('mongoose');
const discountService = require('./discount.service');

const getDiscounts = async (req, res) => {
  try {
    const discounts = await discountService.getDiscounts(req.query);
    res.status(200).json({ message: 'Discounts fetched successfully', data: discounts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDiscountById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid discount id' });
    }

    const discount = await discountService.getDiscountById(id);
    if (!discount) {
      return res.status(404).json({ message: 'Discount not found' });
    }

    res.status(200).json({ message: 'Discount fetched successfully', data: discount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDiscount = async (req, res) => {
  try {
    const discount = await discountService.createDiscount(req.body);
    res.status(201).json({ message: 'Discount created successfully', data: discount });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const updateDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid discount id' });
    }

    const discount = await discountService.updateDiscount(id, req.body);
    if (!discount) {
      return res.status(404).json({ message: 'Discount not found' });
    }

    res.status(200).json({ message: 'Discount updated successfully', data: discount });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const deleteDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid discount id' });
    }

    const discount = await discountService.deleteDiscount(id);
    if (!discount) {
      return res.status(404).json({ message: 'Discount not found' });
    }

    res.status(200).json({ message: 'Discount deleted successfully', data: discount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const validateByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const orderAmount = Number(req.query.orderAmount || 0);

    const discount = await discountService.getDiscountByCode(code);
    const result = discountService.validateDiscountAvailability(discount, orderAmount);

    res.status(200).json({
      message: 'Discount is valid',
      data: result,
    });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const applyToOrder = async (req, res) => {
  try {
    const { orderId, code } = req.body;
    const result = await discountService.applyDiscountToOrder({
      orderId,
      code,
      actor: req.user,
    });

    res.status(200).json({
      message: 'Discount applied to order successfully',
      data: result,
    });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

module.exports = {
  getDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  validateByCode,
  applyToOrder,
};
