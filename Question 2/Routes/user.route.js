import express from 'express';
import { getTopUsers } from '../service/analyticsService.js';

const router = express.Router();

// GET /users - Returns top 5 users with the most commented posts
router.get('/', async (req, res) => {
    try {
        const topUsers = await getTopUsers();
        res.json({ users: topUsers });
    } catch (error) {
        console.error('Error in users route:', error);
        res.status(500).json({ error: 'Failed to fetch top users' });
    }
});

export default router;