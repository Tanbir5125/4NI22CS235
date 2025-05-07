import express from 'express';

import { fetchNumbers } from './Manager/fetchNumber.js';
import { updateWindow, getWindowState, getAverage } from './Manager/windowManager.js'

const app = express();
const PORT = 5002

const validTypes = ['p', 'f', 'e', 'r'];

app.get('/numbers/:numberId', async (req, res) => {
    const { numberId } = req.params;

    if (!validTypes.includes(numberId)) {
        return res.status(400).json({ error: 'Invalid number ID. Use p, f, e, or r.' });
    }

    try {
        const newNumbers = await fetchNumbers(numberId);
        const prevWindow = getWindowState()
        updateWindow(newNumbers);
        const currWindow = getWindowState();
        const avg = getAverage();

        res.json({
            windowPrevState: prevWindow,
            windowCurrState: currWindow,
            numbers: newNumbers,
            avg: avg
        })
    } catch (error) {
        console.error('Request handling error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log('Server is running on port 5002');
})