const mongoose = require("mongoose");

const cartService = require("./cart.service");

const getCarts = async (req, res) => {
	try {
		const carts = await cartService.getCarts();

		res.status(200).json({
			message: "Carts fetched successfully",
			data: carts,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getCartById = async (req, res) => {
	try {
		const { id } = req.params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid cart id" });
		}

		const cart = await cartService.getCartById(id);

		if (!cart) {
			return res.status(404).json({ message: "Cart not found" });
		}

		res.status(200).json({
			message: "Cart fetched successfully",
			data: cart,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const createCart = async (req, res) => {
	try {
		const cart = await cartService.createCart(req.body);

		res.status(201).json({
			message: "Cart created successfully",
			data: cart,
		});
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};

const updateCart = async (req, res) => {
	try {
		const { id } = req.params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid cart id" });
		}

		const cart = await cartService.updateCart(id, req.body);

		if (!cart) {
			return res.status(404).json({ message: "Cart not found" });
		}

		res.status(200).json({
			message: "Cart updated successfully",
			data: cart,
		});
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};

const deleteCart = async (req, res) => {
	try {
		const { id } = req.params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid cart id" });
		}

		const cart = await cartService.deleteCart(id);

		if (!cart) {
			return res.status(404).json({ message: "Cart not found" });
		}

		res.status(200).json({
			message: "Cart deleted successfully",
			data: cart,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	getCarts,
	getCartById,
	createCart,
	updateCart,
	deleteCart,
};
