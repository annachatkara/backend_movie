// Mongoose model for allowed users
const mongoose = require('mongoose');

const allowedUserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('AllowedUser', allowedUserSchema);
