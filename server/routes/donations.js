import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Mock donations database
const donations = [];

// Create donation intent
router.post('/create-intent', [
  body('amount').isFloat({ min: 1 }),
  body('currency').isIn(['USD', 'EUR', 'TRY', 'SAR']),
  body('donorEmail').isEmail().normalizeEmail(),
  body('donorName').trim().isLength({ min: 1 }),
  body('programId').optional().isInt(),
  body('eventId').optional().isInt()
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // In a real app, you'd integrate with Stripe or Iyzico
    const donationIntent = {
      id: Date.now().toString(),
      ...req.body,
      status: 'pending',
      createdAt: new Date()
    };

    donations.push(donationIntent);

    res.json({
      message: 'Donation intent created',
      donationId: donationIntent.id,
      // In real implementation, return payment client secret
      clientSecret: 'mock_client_secret'
    });
  } catch (error) {
    console.error('Create donation intent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Confirm donation
router.post('/confirm/:id', (req, res) => {
  try {
    const donation = donations.find(d => d.id === req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    donation.status = 'completed';
    donation.completedAt = new Date();

    res.json({
      message: 'Donation confirmed successfully',
      donation: {
        id: donation.id,
        amount: donation.amount,
        currency: donation.currency,
        status: donation.status
      }
    });
  } catch (error) {
    console.error('Confirm donation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get donations (admin only)
router.get('/', (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    
    const paginatedDonations = donations.slice(
      parseInt(offset), 
      parseInt(offset) + parseInt(limit)
    );
    
    res.json({
      donations: paginatedDonations,
      total: donations.length,
      hasMore: parseInt(offset) + parseInt(limit) < donations.length
    });
  } catch (error) {
    console.error('Get donations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;