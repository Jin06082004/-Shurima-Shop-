const mongoose = require("mongoose");

const Category = require("./category.model");

const normalizeName = (value) => value.trim().replace(/\s+/g, " ");

const getCategories = async (req, res) => {
	try {
		const categories = await Category.find().sort({ createdAt: -1 });

		res.status(200).json({
			message: "Categories fetched successfully",
			data: categories,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getCategoryById = async (req, res) => {
	try {
		const { id } = req.params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid category id" });
		}

		const category = await Category.findById(id);

		if (!category) {
			return res.status(404).json({ message: "Category not found" });
		}

		res.status(200).json({
			message: "Category fetched successfully",
			data: category,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const createCategory = async (req, res) => {
	try {
		const { name } = req.body;

		if (typeof name !== "string" || !name.trim()) {
			return res.status(400).json({ message: "Category name is required" });
		}

		const normalizedName = normalizeName(name);
		const existingCategory = await Category.findOne({
			name: { $regex: `^${normalizedName}$`, $options: "i" },
		});

		if (existingCategory) {
			return res.status(409).json({ message: "Category already exists" });
		}

		const category = await Category.create({ name: normalizedName });

		res.status(201).json({
			message: "Category created successfully",
			data: category,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const updateCategory = async (req, res) => {
	try {
		const { id } = req.params;
		const { name } = req.body;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid category id" });
		}

		if (typeof name !== "string" || !name.trim()) {
			return res.status(400).json({ message: "Category name is required" });
		}

		const normalizedName = normalizeName(name);
		const existingCategory = await Category.findOne({
			_id: { $ne: id },
			name: { $regex: `^${normalizedName}$`, $options: "i" },
		});

		if (existingCategory) {
			return res.status(409).json({ message: "Category already exists" });
		}

		const category = await Category.findByIdAndUpdate(
			id,
			{ name: normalizedName },
			{ new: true, runValidators: true }
		);

		if (!category) {
			return res.status(404).json({ message: "Category not found" });
		}

		res.status(200).json({
			message: "Category updated successfully",
			data: category,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const deleteCategory = async (req, res) => {
	try {
		const { id } = req.params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid category id" });
		}

		const category = await Category.findByIdAndDelete(id);

		if (!category) {
			return res.status(404).json({ message: "Category not found" });
		}

		res.status(200).json({
			message: "Category deleted successfully",
			data: category,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	getCategories,
	getCategoryById,
	createCategory,
	updateCategory,
	deleteCategory,
};
