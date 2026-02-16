const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { trackEvent, getSummary, getDailyStats, getTopProducts, getEvents } = require('../controllers/analyticController');

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Event tracking & laporan analitik
 */

/**
 * @swagger
 * /analytics/track:
 *   post:
 *     summary: Record event (public, tanpa auth)
 *     tags: [Analytics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [eventType, websiteId]
 *             properties:
 *               eventType:
 *                 type: string
 *                 enum: [page_view, product_view, cta_page_click, cta_product_click]
 *                 example: page_view
 *               websiteId:
 *                 type: integer
 *                 example: 1
 *               productId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Event recorded
 *       400:
 *         description: Validasi gagal
 */

/**
 * @swagger
 * /analytics/summary/{websiteSlug}:
 *   get:
 *     summary: Ringkasan analitik website
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: websiteSlug
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: "Filter mulai tanggal (YYYY-MM-DD)"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: "Filter sampai tanggal (YYYY-MM-DD)"
 *     responses:
 *       200:
 *         description: Ringkasan analitik
 *       404:
 *         description: Website tidak ditemukan
 */

/**
 * @swagger
 * /analytics/daily/{websiteSlug}:
 *   get:
 *     summary: Statistik harian website
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: websiteSlug
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: eventType
 *         schema:
 *           type: string
 *           enum: [page_view, product_view, cta_page_click, cta_product_click]
 *     responses:
 *       200:
 *         description: Statistik harian
 */

/**
 * @swagger
 * /analytics/top-products/{websiteSlug}:
 *   get:
 *     summary: Produk terpopuler di website
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: websiteSlug
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: eventType
 *         schema:
 *           type: string
 *           enum: [product_view, cta_product_click]
 *           default: product_view
 *     responses:
 *       200:
 *         description: Daftar produk terpopuler
 */

/**
 * @swagger
 * /analytics/events/{websiteSlug}:
 *   get:
 *     summary: Daftar raw events (paginated)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: websiteSlug
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: eventType
 *         schema:
 *           type: string
 *           enum: [page_view, product_view, cta_page_click, cta_product_click]
 *     responses:
 *       200:
 *         description: Daftar event dengan pagination
 */

// Public (tanpa auth)
router.post('/track', trackEvent);

// Private (butuh auth — hanya pemilik website)
router.get('/summary/:websiteSlug', authMiddleware, getSummary);
router.get('/daily/:websiteSlug', authMiddleware, getDailyStats);
router.get('/top-products/:websiteSlug', authMiddleware, getTopProducts);
router.get('/events/:websiteSlug', authMiddleware, getEvents);

module.exports = router;
