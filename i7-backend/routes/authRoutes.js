const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers, forgotPassword, verifyOtp, resetPassword, updateUserProfile , changePassword } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', getUsers);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.put('/profile', updateUserProfile);
router.put('/change-password', changePassword);


module.exports = router;