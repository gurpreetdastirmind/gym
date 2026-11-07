const express = require('express');
const router = express.Router();
const { 
  validateCoupon, getCoupons, createCoupon, updateCoupon, deleteCoupon, getSettings, updateSettings 
} = require('../controllers/couponController');

// 1. Coupon Routes
router.post('/validate', validateCoupon);
router.get('/', getCoupons);
router.post('/', createCoupon);

// ✅ 2. Settings Routes MUST be before /:id
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// 3. Dynamic ID Routes (Must be last)
router.put('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);

module.exports = router;