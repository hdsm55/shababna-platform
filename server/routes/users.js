import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database-sqlite.js';
import bcrypt from 'bcryptjs';
import { getAllUsers, getUserProfile, createUser, updateUser, deleteUser, joinOrganization, contactForm } from '../controllers/usersController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Join organization
router.post('/join', joinOrganization);

// Contact form
router.post('/contact', contactForm);

// Get user profile (authenticated user)
router.get('/profile', authMiddleware, getUserProfile);

// Get all users (admin only)
router.get('/', authMiddleware, adminMiddleware, getAllUsers);

// Add new user (admin only)
router.post('/', authMiddleware, adminMiddleware, createUser);

// Update user (admin only)
router.put('/:id', authMiddleware, adminMiddleware, updateUser);

// Delete user (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, deleteUser);

export default router;