const express = require("express");

const router = express.Router();

const {
	getCarts,
	getCartById,
	createCart,
	updateCart,
	deleteCart,
} = require("./cart.controller");

const {
	validateCreateCartBody,
	validateUpdateCartBody,
} = require("./cart.validation");

router.get("/", getCarts);
router.get("/:id", getCartById);
router.post("/", validateCreateCartBody, createCart);
router.put("/:id", validateUpdateCartBody, updateCart);
router.delete("/:id", deleteCart);

module.exports = router;
