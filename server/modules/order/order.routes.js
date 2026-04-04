const express = require("express");

const router = express.Router();

const {
	getOrders,
	getOrderById,
	createOrder,
	updateOrder,
	deleteOrder,
} = require("./order.controller");

const {
	validateCreateOrderBody,
	validateUpdateOrderBody,
} = require("./order.validation");

router.get("/", getOrders);
router.get("/:id", getOrderById);
router.post("/", validateCreateOrderBody, createOrder);
router.put("/:id", validateUpdateOrderBody, updateOrder);
router.delete("/:id", deleteOrder);

module.exports = router;
