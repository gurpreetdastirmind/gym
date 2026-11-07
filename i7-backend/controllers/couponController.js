const Coupon = require('../models/Coupon');
const Setting = require('../models/Setting');

exports.validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal, email } = req.body;

    const coupon = await Coupon.findOne({ where: { code: code.toUpperCase(), isActive: true } });
    if (!coupon) return res.status(404).json({ message: 'Invalid or expired coupon code' });

    if (cartTotal < coupon.minOrderValue) {
      return res.status(400).json({ message: `Minimum order value for this coupon is ₹${coupon.minOrderValue}` });
    }

    const usedByList = coupon.usedBy || [];
    if (email && usedByList.includes(email.toLowerCase())) {
      return res.status(400).json({ message: 'You have already used this coupon code!' });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    res.json({
      message: 'Coupon applied successfully',
      code: coupon.code,
      discountAmount: Math.round(discountAmount),
      discountType: coupon.discountType,
      discountValue: coupon.discountValue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all coupons for Admin
exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.findAll({ order: [['createdAt', 'DESC']] });
    res.json(coupons);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// ✅ Create Coupon
exports.createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderValue } = req.body;
    const existing = await Coupon.findOne({ where: { code: code.toUpperCase() } });
    if (existing) return res.status(400).json({ message: 'Coupon code already exists' });

    const coupon = await Coupon.create({ code: code.toUpperCase(), discountType, discountValue, minOrderValue });
    res.status(201).json(coupon);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// ✅ Update Coupon
exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    await coupon.update(req.body);
    res.json(coupon);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// ✅ Delete Coupon
exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    await coupon.destroy();
    res.json({ message: 'Coupon deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// ✅ Get Settings (Charges)
exports.getSettings = async (req, res) => {
  try {
    const settings = await Setting.findAll();
    const obj = settings.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
    // If DB is empty, send defaults
    res.json({ 
      codCharge: obj.codCharge || '110', 
      shippingCharge: obj.shippingCharge || '110' 
    });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.updateSettings = async (req, res) => {
  try {
    const { codCharge, shippingCharge } = req.body;
    await Setting.findOrCreate({ where: { key: 'codCharge' }, defaults: { value: '110' } }).then(([s]) => s.update({ value: codCharge }));
    await Setting.findOrCreate({ where: { key: 'shippingCharge' }, defaults: { value: '110' } }).then(([s]) => s.update({ value: shippingCharge }));
    res.json({ message: 'Settings updated' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
