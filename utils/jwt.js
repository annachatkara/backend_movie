const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'defaultsecret';

function generateToken(payload) {
    return jwt.sign(payload, secret, { expiresIn: '1h' });
}

function verifyToken(token) {
    try {
        return jwt.verify(token, secret);
    } catch (err) {
        return null;
    }
}

module.exports = { generateToken, verifyToken };
