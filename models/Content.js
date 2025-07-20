// Mongoose model for Content
const mongoose = require('mongoose');

// Episode Schema with videoLink
const episodeSchema = new mongoose.Schema({
    title: String,
    duration: String,
    videoLink: String,  // ✅ Added videoLink here
    dropback: String  // NEW FIELD
});

// Season Schema
const seasonSchema = new mongoose.Schema({
    name: String,
    episodes: [episodeSchema]
});

// Main Content Schema
const contentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['movie', 'series', 'anime', 'tvshow'], required: true },
    description: String,
    poster: String,         // ✅ For main poster image
    dropback: String,       // ✅ For backdrop image
    adult: { type: String, enum: ['yes', 'no'], default: 'no' },
    videoLink: String,        // ✅ For full movie or trailer link
    seasons: [seasonSchema]   // Only if type is series/anime etc
}, { timestamps: true });

module.exports = mongoose.model('Content', contentSchema);
