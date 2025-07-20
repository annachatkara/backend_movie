// Routes for Content
const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const auth = require('../middleware/auth');

// GET all content
router.get('/all', async (req, res) => {
    const data = await Content.find();
    res.json(data);
});

// GET by type
router.get('/:type', async (req, res) => {
    const type = req.params.type.toLowerCase();
    const allowed = ['movie', 'series', 'anime', 'tvshow'];
    if (!allowed.includes(type)) {
    const data = await Content.find();
    res.json(data);
    }

    const data = await Content.find({ type });
    res.json(data);
});

// POST new content
router.post('/', auth, async (req, res) => {
    try {
        const content = new Content(req.body);
        await content.save();
        res.status(201).json(content);
    } catch (err) {
        console.error('Error saving content:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
