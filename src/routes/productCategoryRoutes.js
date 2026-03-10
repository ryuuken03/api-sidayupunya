const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getAll, getDetail, create, update, remove } = require('../controllers/productCategoryController');

/**
 * @swagger
 * tags:
 *   name: ProductCategories
 *   description: API untuk Kategori Produk
 */

/**
 * @swagger
 * /product-categories:
 *   get:
 *     summary: Daftar semua kategori produk
 *     tags: [ProductCategories]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Nomor halaman
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Jumlah item per halaman
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Pencarian berdasarkan nama kategori
 *     responses:
 *       200:
 *         description: Daftar kategori produk
 */

/**
 * @swagger
 * /product-categories/{idOrSlug}:
 *   get:
 *     summary: Detail kategori produk by ID atau slug
 *     tags: [ProductCategories]
 *     parameters:
 *       - in: path
 *         name: idOrSlug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detail kategori produk
 *       404:
 *         description: Kategori produk tidak ditemukan
 */

/**
 * @swagger
 * /product-categories:
 *   post:
 *     summary: Buat kategori produk baru
 *     tags: [ProductCategories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Pakaian Pria
 *     responses:
 *       201:
 *         description: Kategori produk berhasil dibuat
 *       400:
 *         description: Validasi gagal
 *       409:
 *         description: Slug sudah digunakan
 */

/**
 * @swagger
 * /product-categories/{idOrSlug}:
 *   put:
 *     summary: Update kategori produk
 *     tags: [ProductCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idOrSlug
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
 *     responses:
 *       200:
 *         description: Kategori produk berhasil diperbarui
 *       404:
 *         description: Kategori produk tidak ditemukan
 */

/**
 * @swagger
 * /product-categories/{idOrSlug}:
 *   delete:
 *     summary: Hapus kategori produk
 *     tags: [ProductCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idOrSlug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kategori produk berhasil dihapus
 *       404:
 *         description: Kategori produk tidak ditemukan
 */

// Public routes
router.get('/', getAll);
router.get('/:idOrSlug', getDetail);

// Protected routes (admin/user depending on app logic, using authMiddleware)
router.post('/', authMiddleware, create);
router.put('/:idOrSlug', authMiddleware, update);
router.delete('/:idOrSlug', authMiddleware, remove);

module.exports = router;
