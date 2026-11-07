const Category = require('../models/Category');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    
    // ✅ FIX IMAGES BEFORE SENDING
    const fixedCategories = categories.map(c => {
      const category = c.toJSON();
      if (category.image && !category.image.startsWith('http')) {
        category.image = `${BACKEND_URL}${category.image.startsWith('/') ? '' : '/'}${category.image}`;
      }
      return category;
    });

    res.json(fixedCategories);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;
    
    let finalImage = null;

    if (req.file) {
      finalImage = `/uploads/${req.file.filename}`;
    } else if (imageUrl && imageUrl.trim() !== '') {
      finalImage = imageUrl;
    }

    const category = await Category.create({ 
      name, 
      description, 
      image: finalImage 
    });
    
    res.status(201).json(category);
  } catch (error) { res.status(500).json({ message: error.message }); }
};