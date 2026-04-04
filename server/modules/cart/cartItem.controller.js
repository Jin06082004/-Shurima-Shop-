const mongoose = require("mongoose");

const cartItemService = require("./cartItem.service");

const getCartItems = async (req, res) => {
	try {
		const cartItems = await cartItemService.getCartItems();

		res.status(200).json({
			message: "Cart items fetched successfully",
			data: cartItems,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getCartItemById = async (req, res) => {
	try {
		const { id } = req.params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid cart item id" });
		}

		const cartItem = await cartItemService.getCartItemById(id);

		if (!cartItem) {
			return res.status(404).json({ message: "Cart item not found" });
		}

		res.status(200).json({
			message: "Cart item fetched successfully",
			data: cartItem,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const createCartItem = async (req, res) => {
	try {
		const cartItem = await cartItemService.createCartItem(req.body);

		res.status(201).json({
			message: "Cart item created successfully",
			data: cartItem,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const updateCartItem = async (req, res) => {
	try {
		const { id } = req.params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid cart item id" });
		}

		const cartItem = await cartItemService.updateCartItem(id, req.body);

		if (!cartItem) {
			return res.status(404).json({ message: "Cart item not found" });
		}

		res.status(200).json({
			message: "Cart item updated successfully",
			data: cartItem,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const deleteCartItem = async (req, res) => {
	try {
		const { id } = req.params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid cart item id" });
		}

		const cartItem = await cartItemService.deleteCartItem(id);

		if (!cartItem) {
			return res.status(404).json({ message: "Cart item not found" });
		}

		res.status(200).json({
			message: "Cart item deleted successfully",
			data: cartItem,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	getCartItems,
	getCartItemById,
	createCartItem,
	updateCartItem,
	deleteCartItem,
};
