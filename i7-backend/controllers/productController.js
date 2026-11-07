const Product = require('../models/Product');
const Category = require('../models/Category');
const fs = require('fs');
const path = require('path');

// ✅ Helper function to physically rename files on the server
const renameFile = (oldPath, newName) => {
  if (!oldPath) return null;
  const oldAbsolutePath = path.join(__dirname, '..', oldPath); // e.g. uploads/1234.png
  const dir = path.dirname(oldAbsolutePath); // uploads
  const newAbsolutePath = path.join(dir, newName); // uploads/product-cola-1234.png
  const newRelativePath = `/uploads/${newName}`;

  try {
    if (fs.existsSync(oldAbsolutePath)) {
      fs.renameSync(oldAbsolutePath, newAbsolutePath);
      return newRelativePath;
    }
  } catch (err) {
    console.error(`Failed to rename file ${oldPath}:`, err);
  }
  return oldPath;
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ include: Category });
    res.json(products);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, mrp, servings, specifications, tags, sizes, categoryId, benefits, ingredientsData, howToUseData, flavoursData, imageFlavoursMap } = req.body;
    
    let imageUrls = [];
    let parsedIngredients = [];
    let parsedHowToUse = [];
    let parsedFlavours = [];

    if (req.files) {
      // ✅ 1. Main Product Images (Rename based on linked flavour)
      if (req.files['images']) {
        const parsedMap = imageFlavoursMap ? JSON.parse(imageFlavoursMap) : [];
        imageUrls = req.files['images'].map((file, index) => {
          const originalPath = `/uploads/${file.filename}`;
          const linkedFlavour = parsedMap[index] || 'generic';
          const safeFlavour = linkedFlavour.replace(/\s+/g, '_').toLowerCase();
          const newName = `product-${safeFlavour}-${file.filename}`;
          return renameFile(originalPath, newName);
        });
      }

      // ✅ 2. Ingredients
      if (req.files['ingredientImages'] && ingredientsData) {
        const ingredientImages = req.files['ingredientImages'];
        parsedIngredients = JSON.parse(ingredientsData).map((ing, index) => {
          const file = ingredientImages[index];
          if (file && file.filename) {
             const originalPath = `/uploads/${file.filename}`;
             const newName = `ingredient-${file.filename}`;
             return { ...ing, img: renameFile(originalPath, newName) };
          }
          return { ...ing, img: null };
        });
      }

      // ✅ 3. How to Use
      if (req.files['howToUseImages'] && howToUseData) {
        const howToUseImages = req.files['howToUseImages'];
        parsedHowToUse = JSON.parse(howToUseData).map((step, index) => {
          const file = howToUseImages[index];
          if (file && file.filename) {
             const originalPath = `/uploads/${file.filename}`;
             const newName = `howtouse-${file.filename}`;
             return { ...step, img: renameFile(originalPath, newName) };
          }
          return { ...step, img: null };
        });
      }

      // ✅ 4. Flavours (Rename based exactly on the index of flavoursData)
      if (flavoursData) {
        parsedFlavours = JSON.parse(flavoursData).map((flav, index) => {
          const imagesForThisFlavour = [];
          const safeFlavourName = flav.name ? flav.name.replace(/\s+/g, '_').toLowerCase() : 'unknown';
          
          // ✅ Look for the specific indexed file sent from frontend
          const fileKey = `flavourImage_${index}`;
          const file = req.files[fileKey] ? req.files[fileKey][0] : null;

          if (file && file.filename) {
            const originalPath = `/uploads/${file.filename}`;
            const newName = `flavour-${safeFlavourName}-${file.filename}`;
            imagesForThisFlavour.push(renameFile(originalPath, newName));
          }

          const existing = flav.existingImgs || [];
          const allImgs = [...existing, ...imagesForThisFlavour].slice(0, 10);

          return { 
            ...flav, 
            img: allImgs[0] || null, 
            imgs: allImgs 
          };
        });
      }
    }

    const product = await Product.create({ 
      name, description, price, mrp, servings, specifications, tags, sizes, categoryId,
      benefits, 
      howToUse: JSON.stringify(parsedHowToUse), 
      ingredients: JSON.stringify(parsedIngredients), 
      flavours: JSON.stringify(parsedFlavours), 
      images: imageUrls,
      imageFlavoursMap: imageFlavoursMap || '[]'
    });
    
    res.status(201).json(product);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const updateData = { ...req.body };
    
    delete updateData.ingredientsData;
    delete updateData.howToUseData;
    delete updateData.flavoursData; 

    if (req.files) {
      if (req.files['images'] && req.files['images'].length > 0) {
        const parsedMap = req.body.imageFlavoursMap ? JSON.parse(req.body.imageFlavoursMap) : [];
        const newImages = req.files['images'].map((file, index) => {
          const originalPath = `/uploads/${file.filename}`;
          const linkedFlavour = parsedMap[index] || 'generic';
          const safeFlavour = linkedFlavour.replace(/\s+/g, '_').toLowerCase();
          const newName = `product-${safeFlavour}-${file.filename}`;
          return renameFile(originalPath, newName);
        });
        const existingImages = product.images || [];
        updateData.images = [...existingImages, ...newImages].slice(0, 10); 
      }
      
      if (req.body.ingredientsData) {
          const ingredientImages = req.files['ingredientImages'] || [];
          let parsedIngredients = JSON.parse(req.body.ingredientsData);
          parsedIngredients = parsedIngredients.map((ing, index) => {
              const file = ingredientImages[index];
              if (file && file.filename) {
                  const originalPath = `/uploads/${file.filename}`;
                  const newName = `ingredient-${file.filename}`;
                  return { ...ing, img: renameFile(originalPath, newName) };
              }
              return { ...ing, img: ing.img || null };
          });
          updateData.ingredients = JSON.stringify(parsedIngredients);
      }

      if (req.body.howToUseData) {
          const howToUseImgs = req.files['howToUseImages'] || [];
          let parsedHowToUse = JSON.parse(req.body.howToUseData);
          parsedHowToUse = parsedHowToUse.map((step, index) => {
              const file = howToUseImgs[index];
              if (file && file.filename) {
                  const originalPath = `/uploads/${file.filename}`;
                  const newName = `howtouse-${file.filename}`;
                  return { ...step, img: renameFile(originalPath, newName) };
              }
              return { ...step, img: step.img || null };
          });
          updateData.howToUse = JSON.stringify(parsedHowToUse);
      }

      if (req.body.flavoursData) {
          let parsedFlavours = JSON.parse(req.body.flavoursData);
          
          parsedFlavours = parsedFlavours.map((flav, index) => {
              const imagesForThisFlavour = [];
              const safeFlavourName = flav.name ? flav.name.replace(/\s+/g, '_').toLowerCase() : 'unknown';
              
              // ✅ Look for the specific indexed file sent from frontend
              const fileKey = `flavourImage_${index}`;
              const file = req.files[fileKey] ? req.files[fileKey][0] : null;

              if (file && file.filename) {
                const originalPath = `/uploads/${file.filename}`;
                const newName = `flavour-${safeFlavourName}-${file.filename}`;
                imagesForThisFlavour.push(renameFile(originalPath, newName));
              }

              const existing = flav.existingImgs || [];
              const allImgs = [...existing, ...imagesForThisFlavour].slice(0, 10);

              return { 
                ...flav, 
                img: allImgs[0] || null, 
                imgs: allImgs
              };
          });
          updateData.flavours = JSON.stringify(parsedFlavours);
      }
    }

    if (req.body.imageFlavoursMap) {
        updateData.imageFlavoursMap = req.body.imageFlavoursMap;
    }

    await product.update(updateData);
    res.json(product);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.destroy();
    res.json({ message: 'Product deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, { include: Category });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) { res.status(500).json({ message: error.message }); }
};