import express from 'express';
import { query } from '../config/database.js';

const router = express.Router();

// GET /api/stats - return counts for users, programs, events
router.get('/', async (req, res) => {
    try {
        const result = await query(
            `SELECT
         (SELECT COUNT(*) FROM users)::int AS users,
         (SELECT COUNT(*) FROM programs)::int AS programs,
         (SELECT COUNT(*) FROM events)::int AS events`
        );

        const counts = result.rows[0] || { users: 0, programs: 0, events: 0 };

        res.json({
            success: true,
            data: counts,
            message: 'Counts fetched successfully'
        });
    } catch (error) {
        console.error('Stats endpoint error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch stats' });
    }
});

export default router;


