const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const websiteRoutes = require('./websiteRoutes');
const { router: productRoutes, getAll: getProductsByWebsite } = require('./productRoutes');
const analyticRoutes = require('./analyticRoutes');
const userRoutes = require('./userRoutes');
const authMiddleware = require('../middlewares/authMiddleware');

// Mount routes
router.use('/auth', authRoutes);
router.use('/websites', websiteRoutes);
router.use('/products', productRoutes);
router.use('/analytics', analyticRoutes);
router.use('/users', userRoutes);

// Nested: GET /api/websites/:websiteSlug/products (public)
router.get('/websites/:websiteSlug/products', getProductsByWebsite);

module.exports = router;
