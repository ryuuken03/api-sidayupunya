const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getAll, getById, create, update, remove } = require('../controllers/websiteController');

/**
 * @swagger
 * tags:
 *   name: Websites
 *   description: CRUD Website (perlu autentikasi)
 */

/**
 * @swagger
 * /websites:
 *   get:
 *     summary: Daftar semua website milik user
 *     tags: [Websites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar website
 *       401:
 *         description: Token tidak valid
 */

/**
 * @swagger
 * /websites/{id}:
 *   get:
 *     summary: Detail website by ID
 *     tags: [Websites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detail website
 *       404:
 *         description: Website tidak ditemukan
 */

/**
 * @swagger
 * /websites:
 *   post:
 *     summary: Buat website baru
 *     tags: [Websites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, url]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Toko Online
 *               url:
 *                 type: string
 *                 example: https://tokoonline.com
 *               phone:
 *                 type: number
 *                 example: 8123456789
 *               lat:
 *                 type: number
 *                 example: -7.25
 *               lng:
 *                 type: number
 *                 example: 112.75
 *               address:
 *                 type: string
 *                 example: Jl. Contoh No.1
 *               logo:
 *                 type: string
 *                 example: logo.png
 *               description:
 *                 type: string
 *               subdomain:
 *                 type: string
 *                 example: tokoonline
 *     responses:
 *       201:
 *         description: Website berhasil dibuat
 *       400:
 *         description: Validasi gagal
 *       409:
 *         description: Slug sudah digunakan
 */

/**
 * @swagger
 * /websites/{id}:
 *   put:
 *     summary: Update website
 *     tags: [Websites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *               url:
 *                 type: string
 *               phone:
 *                 type: number
 *               lat:
 *                 type: number
 *               lng:
 *                 type: number
 *               address:
 *                 type: string
 *               logo:
 *                 type: string
 *               status:
 *                 type: boolean
 *               canAccess:
 *                 type: boolean
 *               description:
 *                 type: string
 *               subdomain:
 *                 type: string
 *               canExpired:
 *                 type: boolean
 *               hasProduct:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Website berhasil diperbarui
 *       404:
 *         description: Website tidak ditemukan
 *       409:
 *         description: Slug sudah digunakan
 */

/**
 * @swagger
 * /websites/{id}:
 *   delete:
 *     summary: Hapus website (soft delete)
 *     tags: [Websites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Website berhasil dihapus
 *       404:
 *         description: Website tidak ditemukan
 */

router.use(authMiddleware);

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
