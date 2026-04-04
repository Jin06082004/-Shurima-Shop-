const mongoose = require("mongoose");

const Brand = require("./brand.modle");

const normalizeName = (value) => value.trim().replace(/\s+/g, " ");

const getBrands = async (req, res) => {
	try {
		const brands = await Brand.find().sort({ createdAt: -1 });

		res.status(200).json({
			message: "Brands fetched successfully",
			data: brands,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getBrandById = async (req, res) => {
	try {
		const { id } = req.params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid brand id" });
		}

		const brand = await Brand.findById(id);

		if (!brand) {
			return res.status(404).json({ message: "Brand not found" });
		}

		res.status(200).json({
			message: "Brand fetched successfully",
			data: brand,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const createBrand = async (req, res) => {
	try {
		const { name } = req.body;

		if (typeof name !== "string" || !name.trim()) {
			return res.status(400).json({ message: "Brand name is required" });
		}

		const normalizedName = normalizeName(name);
		const existingBrand = await Brand.findOne({
			name: { $regex: `^${normalizedName}$`, $options: "i" },
		});

		if (existingBrand) {
			return res.status(409).json({ message: "Brand already exists" });
		}

		const brand = await Brand.create({ name: normalizedName });

		res.status(201).json({
			message: "Brand created successfully",
			data: brand,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const updateBrand = async (req, res) => {
	try {
		const { id } = req.params;
		const { name } = req.body;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid brand id" });
		}

		if (typeof name !== "string" || !name.trim()) {
			return res.status(400).json({ message: "Brand name is required" });
		}

		const normalizedName = normalizeName(name);
		const existingBrand = await Brand.findOne({
			_id: { $ne: id },
			name: { $regex: `^${normalizedName}$`, $options: "i" },
		});

		if (existingBrand) {
			return res.status(409).json({ message: "Brand already exists" });
		}

		const brand = await Brand.findByIdAndUpdate(
			id,
			{ name: normalizedName },
			{ new: true, runValidators: true }
		);

		if (!brand) {
			return res.status(404).json({ message: "Brand not found" });
		}

		res.status(200).json({
			message: "Brand updated successfully",
			data: brand,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const deleteBrand = async (req, res) => {
	try {
		const { id } = req.params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid brand id" });
		}

		const brand = await Brand.findByIdAndDelete(id);

		if (!brand) {
			return res.status(404).json({ message: "Brand not found" });
		}

		res.status(200).json({
			message: "Brand deleted successfully",
			data: brand,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	getBrands,
	getBrandById,
	createBrand,
	updateBrand,
	deleteBrand,
};
