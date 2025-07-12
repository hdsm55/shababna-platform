import express from 'express';
import { query } from '../config/database.js';
import { getDashboardStats, getDashboardActivities, deleteDashboardEvent, deleteDashboardProgram, deleteDashboardUser, deleteDashboardDonation } from '../controllers/dashboardController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Dashboard stats (admin only)
router.get('/stats', authMiddleware, adminMiddleware, getDashboardStats);

// Dashboard activities (admin only)
router.get('/activities', authMiddleware, adminMiddleware, getDashboardActivities);

// Delete event (admin only)
router.delete('/events/:id', authMiddleware, adminMiddleware, deleteDashboardEvent);

// Delete program (admin only)
router.delete('/programs/:id', authMiddleware, adminMiddleware, deleteDashboardProgram);

// Delete user (admin only)
router.delete('/users/:id', authMiddleware, adminMiddleware, deleteDashboardUser);

// Delete donation (admin only)
router.delete('/donations/:id', authMiddleware, adminMiddleware, deleteDashboardDonation);

export default router;