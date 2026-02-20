const express = require('express');
const router = express.Router();
const { getUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User Management
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Mendapatkan daftar semua user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Berhasil mengambil daftar user
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       username:
 *                         type: string
 *                       status:
 *                         type: boolean
 *                       level_role:
 *                         type: integer
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                       websites:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             name:
 *                               type: string
 *                             slug:
 *                               type: string
 *                             url:
 *                               type: string
 *                             logo:
 *                               type: string
 *                             status:
 *                               type: boolean
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Hanya admin
 *   post:
 *     summary: Menambahkan user baru
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: rahasia123
 *               status:
 *                 type: boolean
 *                 example: true
 *               levelRole:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: User berhasil ditambahkan
 *       400:
 *         description: Validasi gagal
 *       403:
 *         description: Forbidden - Hanya admin
 *       409:
 *         description: Username sudah digunakan
 */
router.get('/', authMiddleware, getUsers);
router.post('/', authMiddleware, createUser);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Mendapatkan detail user berdasarkan ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID User
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan detail user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Berhasil mengambil detail user
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     status:
 *                       type: boolean
 *                     level_role:
 *                       type: integer
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                     websites:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           slug:
 *                             type: string
 *                           url:
 *                             type: string
 *                           logo:
 *                             type: string
 *                           status:
 *                             type: boolean
 *       404:
 *         description: User tidak ditemukan
 *       403:
 *         description: Forbidden - Hanya admin
 *   put:
 *     summary: Memperbarui data user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 6
 *               status:
 *                 type: boolean
 *               levelRole:
 *                 type: integer
 *     responses:
 *       200:
 *         description: User berhasil diperbarui
 *       400:
 *         description: Validasi gagal
 *       403:
 *         description: Forbidden - Hanya admin
 *       404:
 *         description: User tidak ditemukan
 *   delete:
 *     summary: Menghapus user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID User
 *     responses:
 *       200:
 *         description: User berhasil dihapus
 *       403:
 *         description: Forbidden - Hanya admin
 *       404:
 *         description: User tidak ditemukan
 */
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;
