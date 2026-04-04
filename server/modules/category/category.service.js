const Category = require("./category.model");

const normalizeName = (value) => value.trim().replace(/\s+/g, " ");

const getCategories = async () => {
	return Category.find().sort({ createdAt: -1 });
};

const getCategoryById = async (id) => {
	return Category.findById(id);
};

const createCategory = async (name) => {
	const normalizedName = normalizeName(name);

	const existing = await Category.findOne({
		name: { $regex: `^${normalizedName}$`, $options: "i" },
	});

	if (existing) {
		const error = new Error("Category already exists");
		error.status = 409;
		throw error;
	}

	return Category.create({ name: normalizedName });
};

const updateCategory = async (id, name) => {
	const normalizedName = normalizeName(name);

	const existing = await Category.findOne({
		_id: { $ne: id },
		name: { $regex: `^${normalizedName}$`, $options: "i" },
	});

	if (existing) {
		const error = new Error("Category already exists");
		error.status = 409;
		throw error;
	}

	return Category.findByIdAndUpdate(
		id,
		{ name: normalizedName },
		{ new: true, runValidators: true }
	);
};

const deleteCategory = async (id) => {
	return Category.findByIdAndDelete(id);
};

module.exports = {
	getCategories,
	getCategoryById,
	createCategory,
	updateCategory,
	deleteCategory,
};
