import express from 'express';
import { createDonationIntent, confirmDonation, getAllDonations, getMyDonations } from '../controllers/donationsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { body } from 'express-validator';

const router = express.Router();

// Create donation intent (public)
router.post('/create-intent', [
  body('amount').isFloat({ min: 1 }),
  body('currency').isIn(['USD', 'EUR', 'TRY', 'SAR']),
  body('programId').isInt(),
  body('donorName').trim().isLength({ min: 1 }),
  body('donorEmail').isEmail().normalizeEmail()
], createDonationIntent);

// Confirm donation (authenticated)
router.post('/confirm/:id', authMiddleware, confirmDonation);

// Get all donations (admin only)
router.get('/', authMiddleware, adminMiddleware, getAllDonations);

// Get user's donation history (authenticated)
router.get('/my-donations', authMiddleware, getMyDonations);

export default router;