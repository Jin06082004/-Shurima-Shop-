const CartItem = require("./cartItem.model");

const getCartItems = async () => {
	return CartItem.find()
		.sort({ createdAt: -1 })
		.populate("cart")
		.populate("product")
		.populate("variant");
};

const getCartItemById = async (id) => {
	return CartItem.findById(id)
		.populate("cart")
		.populate("product")
		.populate("variant");
};

const createCartItem = async (payload) => {
	return CartItem.create(payload);
};

const updateCartItem = async (id, payload) => {
	return CartItem.findByIdAndUpdate(id, payload, {
		new: true,
		runValidators: true,
	});
};

const deleteCartItem = async (id) => {
	return CartItem.findByIdAndDelete(id);
};

module.exports = {
	getCartItems,
	getCartItemById,
	createCartItem,
	updateCartItem,
	deleteCartItem,
};
