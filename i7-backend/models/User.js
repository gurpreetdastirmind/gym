const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs'); // ✅ Required for hashing the admin password

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user', // Default role for new users
  },
  // ✅ ADDED: Fields for Password Reset OTP
  resetOtp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetOtpExpire: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  timestamps: true,
});

// ✅ Seeder Function to create a default Admin
User.seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) return;

    // Check if admin already exists
    const adminExists = await User.findOne({ where: { email: adminEmail } });
    if (adminExists) return;

    // Hash password and create admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    await User.create({
      fullName: 'Super Admin',
      email: adminEmail,
      phone: '0000000000',
      address: 'Head Office',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ Default Admin Account Created:', adminEmail);
  } catch (error) {
    console.error('❌ Failed to seed admin:', error);
  }
};

module.exports = User;