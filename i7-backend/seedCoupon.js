const sequelize = require('./config/db');
const Coupon = require('./models/Coupon');

sequelize.sync().then(async () => {
  await Coupon.findOrCreate({
    where: { code: 'WELCOME10' },
    defaults: {
      code: 'WELCOME10',
      discountType: 'percentage',
      discountValue: 10, // 10% off
      minOrderValue: 0,
      isActive: true
    }
  });
  console.log('✅ Coupon WELCOME10 created!');
  process.exit();
});