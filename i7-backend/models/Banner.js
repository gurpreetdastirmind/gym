const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Banner = sequelize.define('Banner', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING }, // Optional title for admin reference
  image: { type: DataTypes.STRING, allowNull: false }, // URL or uploaded path
  link: { type: DataTypes.STRING, defaultValue: '#' }, // Where clicking the banner goes
  position: { type: DataTypes.INTEGER, defaultValue: 1 }, // Order of banner (1, 2, 3)
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = Banner;