const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getAll, getAllForAdmin, getBySlug, create, update, remove } = require('../controllers/productController');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: CRUD Produk (perlu autentikasi)
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Daftar semua produk (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar semua produk
 *       403:
 *         description: Forbidden - Hanya admin
 */

/**
 * @swagger
 * /websites/{websiteSlug}/products:
 *   get:
 *     summary: Daftar semua produk di website
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: websiteSlug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Daftar produk
 *       404:
 *         description: Website tidak ditemukan
 */

/**
 * @swagger
 * /products/{slug}:
 *   get:
 *     summary: Detail produk by slug
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detail produk
 *       404:
 *         description: Produk tidak ditemukan
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Buat produk baru
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, websiteId]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Es Teh Jumbo
 *               websiteId:
 *                 type: integer
 *                 example: 1
 *               description:
 *                 type: string
 *                 example: Teh segar ukuran jumbo
 *               price:
 *                 type: number
 *                 example: 5000
 *               discountPercent:
 *                 type: number
 *                 example: 10
 *               discountAmount:
 *                 type: number
 *                 example: 500
 *               hasStock:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Produk berhasil dibuat
 *       400:
 *         description: Validasi gagal
 *       409:
 *         description: Slug sudah digunakan
 */

/**
 * @swagger
 * /products/{slug}:
 *   put:
 *     summary: Update produk
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               discountPercent:
 *                 type: number
 *               discountAmount:
 *                 type: number
 *               hasStock:
 *                 type: boolean
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Produk berhasil diperbarui
 *       404:
 *         description: Produk tidak ditemukan
 */

/**
 * @swagger
 * /products/{slug}:
 *   delete:
 *     summary: Hapus produk (soft delete)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produk berhasil dihapus
 *       404:
 *         description: Produk tidak ditemukan
 */

// Public
router.get('/:slug', getBySlug);

// Auth required
router.get('/', authMiddleware, getAllForAdmin);
router.post('/', authMiddleware, create);
router.put('/:slug', authMiddleware, update);
router.delete('/:slug', authMiddleware, remove);

// Mounted separately in index.js: GET /api/websites/:websiteSlug/products
module.exports = { router, getAll };
