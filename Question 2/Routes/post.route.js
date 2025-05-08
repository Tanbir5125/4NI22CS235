import express from 'express';
import { getPosts } from '../service/analyticsService.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { type = 'popular' } = req.query;

        // Validate type parameter
        if (!['popular', 'latest'].includes(type)) {
            return res.status(400).json({
                error: 'Invalid type parameter. Accepted values: popular, latest'
            });
        }

        const posts = await getPosts(type);
        res.json({ posts });
    } catch (error) {
        console.error('Error in posts route:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

export default router;