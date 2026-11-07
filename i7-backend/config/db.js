const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // required for Neon
    },
  },
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ CONNECTED TO NEON POSTGRES SUCCESSFULLY');
  } catch (error) {
    console.error('❌ DATABASE CONNECTION FAILED:', error.message);
  }
};

connectDB();

module.exports = sequelize;