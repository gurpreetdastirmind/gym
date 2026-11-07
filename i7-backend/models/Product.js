const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Category = require('./Category');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
 price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
mrp:   { type: DataTypes.DECIMAL(10, 2) },
  servings: { type: DataTypes.STRING },
  images: { 
    type: DataTypes.TEXT, 
    defaultValue: '[]',
    get() { return this.getDataValue('images') ? JSON.parse(this.getDataValue('images')) : []; },
    set(val) { this.setDataValue('images', JSON.stringify(val || [])); }
  },
  
  imageFlavoursMap: { type: DataTypes.TEXT, defaultValue: '[]' },

  specifications: { type: DataTypes.TEXT },
  tags: { type: DataTypes.STRING },
  sizes: { type: DataTypes.STRING },
  
  ingredients: { type: DataTypes.TEXT }, 
  benefits: { type: DataTypes.TEXT },    
  howToUse: { type: DataTypes.TEXT },    
  flavours: { type: DataTypes.TEXT }, 
  
  categoryId: {
    type: DataTypes.INTEGER,
    references: { model: Category, key: 'id' }
  }
});

Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = Product;