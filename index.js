// Entry point for the movie API
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const contentRoutes = require('./routes/content');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.log('❌ MongoDB error', err));

// Routes
app.use('/api', contentRoutes);
app.use('/api/auth', authRoutes);

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
