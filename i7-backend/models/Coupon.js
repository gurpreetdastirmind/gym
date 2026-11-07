const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Coupon = sequelize.define('Coupon', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  code: { type: DataTypes.STRING, allowNull: false, unique: true },
  discountType: { type: DataTypes.ENUM('percentage', 'fixed'), defaultValue: 'percentage' },
  discountValue: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
minOrderValue: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  usedBy: { 
    type: DataTypes.TEXT, 
    defaultValue: '[]', 
    get() { return JSON.parse(this.getDataValue('usedBy') || '[]'); },
    set(val) { this.setDataValue('usedBy', JSON.stringify(val)); }
  }
});

module.exports = Coupon;