const Order = require("./order.model");

const getOrders = async () => {
	return Order.find().sort({ createdAt: -1 }).populate("user");
};

const getOrderById = async (id) => {
	return Order.findById(id).populate("user");
};

const createOrder = async (payload) => {
	return Order.create(payload);
};

const updateOrder = async (id, payload) => {
	return Order.findByIdAndUpdate(id, payload, {
		new: true,
		runValidators: true,
	});
};

const deleteOrder = async (id) => {
	return Order.findByIdAndDelete(id);
};

module.exports = {
	getOrders,
	getOrderById,
	createOrder,
	updateOrder,
	deleteOrder,
};
