const mongoose = require("mongoose");

const orderItemService = require("./orderItem.service");

const getOrderItems = async (req, res) => {
	try {
		const orderItems = await orderItemService.getOrderItems();

		res.status(200).json({
			message: "Order items fetched successfully",
			data: orderItems,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getOrderItemById = async (req, res) => {
	try {
		const { id } = req.params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid order item id" });
		}

		const orderItem = await orderItemService.getOrderItemById(id);

		if (!orderItem) {
			return res.status(404).json({ message: "Order item not found" });
		}

		res.status(200).json({
			message: "Order item fetched successfully",
			data: orderItem,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const createOrderItem = async (req, res) => {
	try {
		const orderItem = await orderItemService.createOrderItem(req.body);

		res.status(201).json({
			message: "Order item created successfully",
			data: orderItem,
		});
	} catch (error) {
		res.status(error.statusCode || 500).json({ message: error.message });
	}
};

const updateOrderItem = async (req, res) => {
	try {
		const { id } = req.params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid order item id" });
		}

		const orderItem = await orderItemService.updateOrderItem(id, req.body);

		if (!orderItem) {
			return res.status(404).json({ message: "Order item not found" });
		}

		res.status(200).json({
			message: "Order item updated successfully",
			data: orderItem,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const deleteOrderItem = async (req, res) => {
	try {
		const { id } = req.params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid order item id" });
		}

		const orderItem = await orderItemService.deleteOrderItem(id);

		if (!orderItem) {
			return res.status(404).json({ message: "Order item not found" });
		}

		res.status(200).json({
			message: "Order item deleted successfully",
			data: orderItem,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	getOrderItems,
	getOrderItemById,
	createOrderItem,
	updateOrderItem,
	deleteOrderItem,
};
