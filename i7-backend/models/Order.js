const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  orderNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
  userEmail: { type: DataTypes.STRING, allowNull: false },
  userPhone: { type: DataTypes.STRING, allowNull: false },
  
  shippingAddress: { 
    type: DataTypes.TEXT, 
    allowNull: false,
    get() { return JSON.parse(this.getDataValue('shippingAddress')); },
    set(val) { this.setDataValue('shippingAddress', JSON.stringify(val)); }
  },
  items: { 
    type: DataTypes.TEXT, 
    allowNull: false,
    get() { return JSON.parse(this.getDataValue('items')); },
    set(val) { this.setDataValue('items', JSON.stringify(val)); }
  },
  
 subtotal:        { type: DataTypes.DECIMAL(10, 2), allowNull: false },
shippingCharge:  { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
codCharge:       { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
discount:        { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
totalAmount:     { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  
  paymentMethod: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'Processing' }, // Processing, Shipped, Out for Delivery, Delivered, Cancelled
  couponCode: { type: DataTypes.STRING, allowNull: true },
  
  // ✅ NEW FIELDS FOR CANCELLATION
  cancelReason: { type: DataTypes.TEXT, allowNull: true },
  cancelStatus: { type: DataTypes.STRING, defaultValue: 'None' }, // None, Requested, Approved, Rejected
}, {
  timestamps: true,
});

module.exports = Order;