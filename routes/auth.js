const express = require('express');
const router = express.Router();
const { generateToken } = require('../utils/jwt');
const AllowedUser = require('../models/AllowedUser');

// Dummy login route for demonstration
router.post('/login', async (req, res) => {
    const { username } = req.body;
    console.log('Login attempt with username:', username);
    if (!username) {
        return res.status(400).json({ message: 'Username required' });
    }
    const user = await AllowedUser.findOne({ username });
    console.log('User found in DB:', user);
    if (!user) {
        return res.status(403).json({ message: 'User not allowed' });
    }
    const token = generateToken({ username });
    res.json({ token });
});

module.exports = router;
