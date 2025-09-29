import express from 'express';
import { sendOtp, verifyOtp, googleAuth } from '../controllers/authController';
import { body } from 'express-validator';

const router = express.Router();

router.post('/send-otp', 
  body('email').isEmail().withMessage('Valid email required'),
  body('name').notEmpty().withMessage('Name required'),
  sendOtp);

router.post('/verify-otp', verifyOtp);
router.post('/google', googleAuth);

export default router;
