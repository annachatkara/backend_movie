const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const auth = require('../middleware/auth');
const ObjectId = require('mongoose').Types.ObjectId;

// GET all content (latest 30 by default, cursor-based)
router.get('/all', async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const lastId = req.query.lastId;
    let query = {};

    // Latest first, so we need cursor in DESC direction
    if (lastId) {
        // first, find the doc to get its createdAt
        const lastDoc = await Content.findById(lastId);
        if (lastDoc) {
            // For infinite scroll latest first:
            // All docs with createdAt < lastDoc.createdAt,
            // OR createdAt == lastDoc.createdAt AND _id < lastId
            query.$or = [
                { createdAt: { $lt: lastDoc.createdAt } },
                { createdAt: lastDoc.createdAt, _id: { $lt: new ObjectId(lastId) } }
            ];
        }
    }

    // Sort: Latest first (createdAt DESC, _id for tie-breaker)
    const data = await Content.find(query)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit);

    res.json(data);
});

// GET by type with safe cursor-based infinite scroll
router.get('/:type', async (req, res) => {
    const type = req.params.type.toLowerCase();
    const allowed = ['movie', 'anime', 'tvshow'];
    const limit = parseInt(req.query.limit) || 10;
    const lastId = req.query.lastId;
    let query = {};
    if (allowed.includes(type)) {
        query.type = type;
    }
    if (lastId) {
        query._id = { $gt: new ObjectId(lastId) }; // Use 'new' with ObjectId
    }
    const data = await Content.find(query)
        .sort({ _id: 1 }) // UNIQUE FIELD ascending!
        .limit(limit);
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
