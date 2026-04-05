const OrderItem = require("./orderItem.model");
const Order = require("./order.model");
const Product = require("../product/product.model");
const Variant = require("../product/variant.model");

/**
 * Recalculate and persist the total price of the order from its items.
 */
const recalcOrderTotal = async (orderId) => {
	const items = await OrderItem.find({ order: orderId });
	const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
	await Order.findByIdAndUpdate(orderId, { totalPrice: Math.round(total * 100) / 100 });
};

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
	const { order, product, variant, quantity } = payload;
	let price;

	if (variant) {
		const variantDoc = await Variant.findById(variant);
		if (!variantDoc) {
			const err = new Error('Variant not found');
			err.statusCode = 404;
			throw err;
		}
		if (variantDoc.stock < quantity) {
			const err = new Error('Insufficient stock for the selected variant');
			err.statusCode = 400;
			throw err;
		}
		// Use variant price if set, otherwise fall back to product price
		if (variantDoc.price != null) {
			price = variantDoc.price;
		} else {
			const productDoc = await Product.findById(product);
			price = productDoc ? productDoc.price : 0;
		}
		await Variant.findByIdAndUpdate(variant, { $inc: { stock: -quantity } });
	} else {
		const productDoc = await Product.findById(product);
		if (!productDoc) {
			const err = new Error('Product not found');
			err.statusCode = 404;
			throw err;
		}
		if (productDoc.stock < quantity) {
			const err = new Error('Insufficient stock for this product');
			err.statusCode = 400;
			throw err;
		}
		price = productDoc.price;
		await Product.findByIdAndUpdate(product, { $inc: { stock: -quantity } });
	}

	const item = await OrderItem.create({ order, product, variant, quantity, price });
	await recalcOrderTotal(order);
	return item;
};

const updateOrderItem = async (id, payload) => {
	const item = await OrderItem.findByIdAndUpdate(id, payload, {
		new: true,
		runValidators: true,
	});

	if (item) {
		await recalcOrderTotal(item.order);
	}

	return item;
};

const deleteOrderItem = async (id) => {
	const item = await OrderItem.findByIdAndDelete(id);

	if (item) {
		await recalcOrderTotal(item.order);
	}

	return item;
};

module.exports = {
	getOrderItems,
	getOrderItemById,
	createOrderItem,
	updateOrderItem,
	deleteOrderItem,
};
