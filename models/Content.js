const express = require('express');
const router = express.Router();
const Content = require('../models/Content'); // Case-sensitive! Check 'C' in Content
const auth = require('../middleware/auth');
const ObjectId = require('mongoose').Types.ObjectId;

// GET all content (latest 30 by default, cursor-based)
router.get('/all', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const lastId = req.query.lastId;
  let query = {};

  if (lastId) {
    const lastDoc = await Content.findById(lastId);
    if (lastDoc) {
      query.$or = [
        { createdAt: { $lt: lastDoc.createdAt } },
        { createdAt: lastDoc.createdAt, _id: { $lt: new ObjectId(lastId) } }
      ];
    }
  }

  const data = await Content.find(query)
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit);

  res.json(data);
});

// GET by type with safe cursor-based infinite scroll
router.get('/:type', async (req, res) => {
  const type = req.params.type.toLowerCase();
  const allowed = ['movie', 'anime', 'tvshow', 'series'];
  const limit = parseInt(req.query.limit) || 10;
  const lastId = req.query.lastId;
  let query = {};

  if (allowed.includes(type)) {
    query.type = type;
  }
  if (lastId) {
    query._id = { $gt: new ObjectId(lastId) };
  }

  const data = await Content.find(query)
    .sort({ _id: 1 })
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
