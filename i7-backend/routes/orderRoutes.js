const express = require('express');
const router = express.Router();
const { createOrder, trackOrder, getAllOrders, updateOrderStatus,requestCancel, handleCancelRequest  } = require('../controllers/orderController');

router.post('/create', createOrder);
router.post('/track', trackOrder);
router.post('/cancel-request', requestCancel);
router.get('/', getAllOrders);
router.put('/:id/status', updateOrderStatus);
router.put('/:id/cancel', handleCancelRequest);

module.exports = router;