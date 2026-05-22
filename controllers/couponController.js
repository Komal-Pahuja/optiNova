const Coupon = require('../models/Coupon');

const apiListCoupons = async (req, res) => {
  const coupons = await Coupon.find({ active: true, expiresAt: { $gt: new Date() } }).select('code type value minCartAmount expiresAt');
  return res.json(coupons);
};

const apiApplyCoupon = async (req, res) => {
  const { couponCode, cartTotal } = req.body;
  if (!couponCode) {
    return res.status(400).json({ message: 'Coupon code is required' });
  }

  const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), active: true, expiresAt: { $gt: new Date() } });
  if (!coupon) {
    return res.status(404).json({ message: 'Coupon not found or expired' });
  }

  const total = Number(cartTotal || 0);
  if (coupon.minCartAmount && total < coupon.minCartAmount) {
    return res.status(400).json({ message: `Coupon requires a minimum cart total of $${coupon.minCartAmount.toFixed(2)}` });
  }

  let discountAmount = 0;
  if (coupon.type === 'fixed') {
    discountAmount = coupon.value;
  } else {
    discountAmount = (coupon.value / 100) * total;
  }

  discountAmount = Math.min(discountAmount, total);

  return res.json({ coupon, discountAmount });
};

module.exports = {
  apiListCoupons,
  apiApplyCoupon,
};
