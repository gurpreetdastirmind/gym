const Banner = require('../models/Banner');

const BACKEND_URL = process.env.BACKEND_URL || 'https://i7-backend.onrender.com';

exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.findAll({ order: [['position', 'ASC']] });
    
    // ✅ FIX IMAGES BEFORE SENDING
    const fixedBanners = banners.map(b => {
      const banner = b.toJSON();
      if (banner.image && !banner.image.startsWith('http')) {
        banner.image = `${BACKEND_URL}${banner.image.startsWith('/') ? '' : '/'}${banner.image}`;
      }
      return banner;
    });

    res.json(fixedBanners);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.createBanner = async (req, res) => {
  try {
    const { title, link, position, imageUrl } = req.body;
    
    let finalImage = null;

    if (req.file) {
      finalImage = `/uploads/${req.file.filename}`;
    } else if (imageUrl && imageUrl.trim() !== '') {
      finalImage = imageUrl;
    } else {
      return res.status(400).json({ message: 'Please provide an image' });
    }

    const banner = await Banner.create({ 
      title, 
      link, 
      position, 
      image: finalImage 
    });
    
    res.status(201).json(banner);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByPk(id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });

    await banner.destroy();
    res.json({ message: 'Banner deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, link, position, imageUrl } = req.body;
    
    const banner = await Banner.findByPk(id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });

    let finalImage = banner.image; // Keep existing image by default

    if (req.file) {
      finalImage = `/uploads/${req.file.filename}`;
    } else if (imageUrl && imageUrl.trim() !== '') {
      finalImage = imageUrl;
    }

    await banner.update({ 
      title, 
      link, 
      position, 
      image: finalImage 
    });
    
    res.json(banner);
  } catch (error) { res.status(500).json({ message: error.message }); }
};