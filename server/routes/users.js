import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Users API routes
const users = [];

// Join organization
router.post('/join', [
  body('firstName').trim().isLength({ min: 1 }),
  body('lastName').trim().isLength({ min: 1 }),
  body('email').isEmail().normalizeEmail(),
  body('phone').trim().isLength({ min: 1 }),
  body('country').trim().isLength({ min: 1 }),
  body('age').isInt({ min: 16, max: 35 }),
  body('interests').isArray({ min: 1 }),
  body('motivation').trim().isLength({ min: 10 })
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const membershipApplication = {
      id: Date.now().toString(),
      ...req.body,
      status: 'pending',
      submittedAt: new Date()
    };

    // In a real app, you'd save to database
    users.push(membershipApplication);

    res.status(201).json({
      message: 'Membership application submitted successfully',
      applicationId: membershipApplication.id
    });
  } catch (error) {
    console.error('Join organization error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Contact form
router.post('/contact', [
  body('name').trim().isLength({ min: 1 }),
  body('email').isEmail().normalizeEmail(),
  body('subject').trim().isLength({ min: 1 }),
  body('message').trim().isLength({ min: 10 })
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contactMessage = {
      id: Date.now().toString(),
      ...req.body,
      status: 'new',
      submittedAt: new Date()
    };

    // In a real app, you'd save to database and possibly send email
    console.log('Contact message received:', contactMessage);

    res.json({
      message: 'Message sent successfully',
      messageId: contactMessage.id
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;