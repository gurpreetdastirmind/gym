const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/db');
const User = require('./models/User');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const path = require('path');
const bannerRoutes = require('./routes/bannerRoutes');
const Banner = require('./models/Banner');
const Coupon = require('./models/Coupon');
const Setting = require('./models/Setting');
const couponRoutes = require('./routes/couponRoutes');
const Order = require('./models/Order');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// ✅ Allow local dev + your deployed frontend
const allowedOrigins = [
  'http://localhost:5173',
  'https://i7-frontend.onrender.com', // ← replace after deploy
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/banners', bannerRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => res.send('i7 Nutrition API is running...'));

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: false }).then(async () => {
  console.log('✅ Database synced');
  await User.seedAdmin();
  await Setting.findOrCreate({ where: { key: 'codCharge' }, defaults: { value: '55' } });
  await Setting.findOrCreate({ where: { key: 'shippingCharge' }, defaults: { value: '110' } });

  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch((err) => {
  console.error('❌ Failed to sync database:', err);
});