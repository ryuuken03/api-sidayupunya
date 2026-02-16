const express = require('express');
const router = express.Router({ mergeParams: true });
const authMiddleware = require('../middlewares/authMiddleware');
const { getAll, getById, create, update, remove } = require('../controllers/productController');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: CRUD Produk (nested di bawah website, perlu autentikasi)
 */

/**
 * @swagger
 * /websites/{websiteId}/products:
 *   get:
 *     summary: Daftar semua produk di website
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: websiteId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Daftar produk
 *       404:
 *         description: Website tidak ditemukan
 */

/**
 * @swagger
 * /websites/{websiteId}/products/{id}:
 *   get:
 *     summary: Detail produk by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: websiteId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detail produk
 *       404:
 *         description: Produk tidak ditemukan
 */

/**
 * @swagger
 * /websites/{websiteId}/products:
 *   post:
 *     summary: Buat produk baru
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: websiteId
 *         required: true
 *         schema:
 *           type: integer
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
 *                 example: Es Teh Jumbo
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
 *       404:
 *         description: Website tidak ditemukan
 */

/**
 * @swagger
 * /websites/{websiteId}/products/{id}:
 *   put:
 *     summary: Update produk
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: websiteId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 * /websites/{websiteId}/products/{id}:
 *   delete:
 *     summary: Hapus produk (soft delete)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: websiteId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produk berhasil dihapus
 *       404:
 *         description: Produk tidak ditemukan
 */

router.use(authMiddleware);

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
