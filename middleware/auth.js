// Auth middleware
require('dotenv').config();

module.exports = function (req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided.' });
    }
    const token = authHeader.split(' ')[1];
    const { verifyToken } = require('../utils/jwt');
    const payload = verifyToken(token);
    if (!payload) {
        return res.status(403).json({ message: 'Access denied. Invalid token.' });
    }
    req.user = payload;
    next();
}
