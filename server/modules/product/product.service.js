const Product = require('./product.model');
const Variant = require('./variant.model'); // Import Variant to attach to product

/**
 * Get all products with pagination, search, filter, and sorting.
 */
const getAllProducts = async (query) => {
  const {
    page = 1,
    limit = 10,
    search,
    category,
    minPrice,
    maxPrice,
    sort = 'newest',
  } = query;

  const filter = { isActive: true };

  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  if (category) {
    filter.category = category;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
  }

  const sortOptions = {};
  if (sort === 'newest') {
    sortOptions.createdAt = -1;
  } else if (sort === 'price_asc') {
    sortOptions.price = 1;
  } else if (sort === 'price_desc') {
    sortOptions.price = -1;
  } else if (sort === 'rating') {
    sortOptions.avgRating = -1;
  }

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name')
      .populate('brand', 'name')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Product.countDocuments(filter),
  ]);

  // Attach variants to all products
  const productIds = products.map((p) => p._id);
  const variants = await Variant.find({ productId: { $in: productIds } }).lean();
  
  for (const product of products) {
    product.variants = variants.filter((v) => v.productId.toString() === product._id.toString());
  }

  return {
    products,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

/**
 * Get a single product by ID.
 */
const getProductById = async (id) => {
  const product = await Product.findById(id)
    .populate('category', 'name')
    .populate('brand', 'name')
    .lean();

  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }
  
  // Attach single product variants
  product.variants = await Variant.find({ productId: product._id }).lean();

  return product;
};

/**
 * Create a new product.
 */
const createProduct = async (data) => {
  const product = await Product.create(data);
  return product.populate([
    { path: 'category', select: 'name' },
    { path: 'brand', select: 'name' },
  ]);
};

/**
 * Update an existing product by ID.
 */
const updateProduct = async (id, data) => {
  const product = await Product.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  )
    .populate('category', 'name')
    .populate('brand', 'name');

  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  return product;
};

/**
 * Soft-delete a product by setting isActive = false.
 */
const deleteProduct = async (id) => {
  const product = await Product.findByIdAndUpdate(
    id,
    { $set: { isActive: false } },
    { new: true }
  );

  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  // Optional: Also soft delete variants here if required.

  return { message: 'Product deleted successfully' };
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
