const express = require("express");

const router = express.Router();

const {
	getCartItems,
	getCartItemById,
	createCartItem,
	updateCartItem,
	deleteCartItem,
} = require("./cartItem.controller");

const {
	validateCreateCartItemBody,
	validateUpdateCartItemBody,
} = require("./cartItem.validation");

router.get("/", getCartItems);
router.get("/:id", getCartItemById);
router.post("/", validateCreateCartItemBody, createCartItem);
router.put("/:id", validateUpdateCartItemBody, updateCartItem);
router.delete("/:id", deleteCartItem);

module.exports = router;
