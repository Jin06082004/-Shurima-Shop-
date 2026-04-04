const express = require("express");

const router = express.Router();

const {
	getOrderItems,
	getOrderItemById,
	createOrderItem,
	updateOrderItem,
	deleteOrderItem,
} = require("./orderItem.controller");

const {
	validateCreateOrderItemBody,
	validateUpdateOrderItemBody,
} = require("./orderItem.validation");

router.get("/", getOrderItems);
router.get("/:id", getOrderItemById);
router.post("/", validateCreateOrderItemBody, createOrderItem);
router.put("/:id", validateUpdateOrderItemBody, updateOrderItem);
router.delete("/:id", deleteOrderItem);

module.exports = router;
