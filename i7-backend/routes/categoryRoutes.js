const express = require('express');
const router = express.Router();
const { getCategories, createCategory } = require('../controllers/categoryController');
const upload = require('../middleware/upload'); // Import upload middleware

router.get('/', getCategories);
// ✅ Add upload.single('image') to handle the file
router.post('/', upload.single('image'), createCategory); 

module.exports = router;