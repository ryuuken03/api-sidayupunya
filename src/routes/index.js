const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const websiteRoutes = require('./websiteRoutes');
const productRoutes = require('./productRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/websites', websiteRoutes);
router.use('/websites/:websiteId/products', productRoutes);

module.exports = router;
