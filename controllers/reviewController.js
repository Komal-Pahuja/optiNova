const Review = require('../models/Review');
const Product = require('../models/Product');

const apiGetRatings = async (req, res) => {
  const ratings = await Review.aggregate([
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  const result = ratings.map((item) => ({
    productId: item._id.toString(),
    averageRating: Number(item.averageRating.toFixed(1)),
    reviewCount: item.reviewCount,
  }));
  return res.json(result);
};

const apiCreateOrUpdateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be a value between 1 and 5' });
  }

  const reviewData = {
    user: req.auth.id,
    product: id,
    rating: Number(rating),
    comment: comment || '',
  };

  const existing = await Review.findOne({ user: req.auth.id, product: id });
  if (existing) {
    existing.rating = reviewData.rating;
    existing.comment = reviewData.comment;
    await existing.save();
    return res.json(existing);
  }

  const review = await Review.create(reviewData);
  return res.json(review);
};

module.exports = {
  apiGetRatings,
  apiCreateOrUpdateReview,
};
