import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import {
    getAllContactForms,
    getContactFormById,
    updateContactFormReadStatus,
    deleteContactForm
} from '../controllers/contactFormsController.js';

const router = express.Router();

// Get all contact forms (admin only)
router.get('/', authMiddleware, adminMiddleware, getAllContactForms);

// Get single contact form (admin only)
router.get('/:id', authMiddleware, adminMiddleware, getContactFormById);

// Update read status (admin only)
router.patch('/:id/read', authMiddleware, adminMiddleware, updateContactFormReadStatus);

// Delete contact form (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, deleteContactForm);

export default router;
