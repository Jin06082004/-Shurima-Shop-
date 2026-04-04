const OrderItem = require("./orderItem.model");

const getOrderItems = async () => {
	return OrderItem.find()
		.sort({ createdAt: -1 })
		.populate("order")
		.populate("product")
		.populate("variant");
};

const getOrderItemById = async (id) => {
	return OrderItem.findById(id)
		.populate("order")
		.populate("product")
		.populate("variant");
};

const createOrderItem = async (payload) => {
	return OrderItem.create(payload);
};

const updateOrderItem = async (id, payload) => {
	return OrderItem.findByIdAndUpdate(id, payload, {
		new: true,
		runValidators: true,
	});
};

const deleteOrderItem = async (id) => {
	return OrderItem.findByIdAndDelete(id);
};

module.exports = {
	getOrderItems,
	getOrderItemById,
	createOrderItem,
	updateOrderItem,
	deleteOrderItem,
};
