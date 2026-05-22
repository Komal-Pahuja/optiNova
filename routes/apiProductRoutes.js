const express = require('express');
const { apiGetProducts, apiGetProduct, apiGetProductFilters, apiGetCategories } = require('../controllers/productController');
const { apiGetRatings, apiCreateOrUpdateReview } = require('../controllers/reviewController');
const { apiRequireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/filters', apiGetProductFilters);
router.get('/categories', apiGetCategories);
router.get('/ratings', apiGetRatings);
router.get('/', apiGetProducts);
router.get('/:id', apiGetProduct);
router.post('/:id/rate', apiRequireAuth, apiCreateOrUpdateReview);

module.exports = router;
