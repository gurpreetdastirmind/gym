const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;
    
    let finalImage = null;

    // 1. Check if a file was uploaded
    if (req.file) {
      finalImage = `/uploads/${req.file.filename}`;
    } 
    // 2. If no file uploaded, check if a URL was provided
    else if (imageUrl && imageUrl.trim() !== '') {
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