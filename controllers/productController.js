const Product = require('../models/Product');
const Category = require('../models/Category');
const { frameTypes, lensTypes, genderTypes } = require('../utils/constants');

const buildProductFilter = (query) => {
  const filter = {};
  if (query.category) filter.category = query.category;
  if (query.brand) filter.brand = query.brand;
  if (query.frameType) filter.frameType = query.frameType;
  if (query.lensType) filter.lensType = query.lensType;
  if (query.gender) filter.gender = query.gender;

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  return filter;
};

const listProducts = async (req, res) => {
  const filter = buildProductFilter(req.query);
  const [products, categories, brands] = await Promise.all([
    Product.find(filter).populate('category').sort({ createdAt: -1 }),
    Category.find().sort({ name: 1 }),
    Product.distinct('brand'),
  ]);

  return res.render('pages/products', {
    title: 'Products',
    products,
    categories,
    brands,
    frameTypes,
    lensTypes,
    genderTypes,
    query: req.query,
  });
};

const productDetails = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category');
  if (!product) {
    return res.status(404).render('pages/error', {
      title: 'Not Found',
      message: 'Product not found',
    });
  }

  return res.render('pages/product-details', {
    title: product.name,
    product,
  });
};

const apiGetProducts = async (req, res) => {
  const filter = buildProductFilter(req.query);
  const products = await Product.find(filter).populate('category').sort({ createdAt: -1 });
  return res.json(products);
};

const apiGetProductFilters = async (req, res) => {
  const [categories, brands] = await Promise.all([
    Category.find().sort({ name: 1 }),
    Product.distinct('brand'),
  ]);
  return res.json({ categories, brands, frameTypes, lensTypes, genderTypes });
};

const apiGetCategories = async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  return res.json(categories);
};

const apiGetProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category');
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  return res.json(product);
};

module.exports = {
  listProducts,
  productDetails,
  apiGetProducts,
  apiGetProduct,
  apiGetProductFilters,
  apiGetCategories,
};
