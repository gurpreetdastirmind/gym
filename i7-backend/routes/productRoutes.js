const express = require('express');
const router = express.Router();
const { getProducts, createProduct, updateProduct, deleteProduct, getProductById } = require('../controllers/productController');
const upload = require('../middleware/upload');

// ✅ Whitelist every possible indexed flavour image field so Multer
//    stops throwing LIMIT_UNEXPECTED_FILE for "flavourImage_0", etc.
const cpUpload = upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'howToUseImages', maxCount: 10 },
  { name: 'ingredientImages', maxCount: 15 },

  // ✅ Dynamic per-flavour image fields (frontend sends flavourImage_<index>)
  { name: 'flavourImage_0', maxCount: 1 },
  { name: 'flavourImage_1', maxCount: 1 },
  { name: 'flavourImage_2', maxCount: 1 },
  { name: 'flavourImage_3', maxCount: 1 },
  { name: 'flavourImage_4', maxCount: 1 },
  { name: 'flavourImage_5', maxCount: 1 },
  { name: 'flavourImage_6', maxCount: 1 },
  { name: 'flavourImage_7', maxCount: 1 },
  { name: 'flavourImage_8', maxCount: 1 },
  { name: 'flavourImage_9', maxCount: 1 },

  // (kept for backward compatibility — not used by current frontend)
  { name: 'flavourImages', maxCount: 1 },
]);

router.get('/', getProducts);
router.post('/', cpUpload, createProduct);
router.put('/:id', cpUpload, updateProduct);
router.delete('/:id', deleteProduct);
router.get('/:id', getProductById);

module.exports = router;