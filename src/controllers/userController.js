const { User, Website } = require('../models');
const bcrypt = require('bcryptjs');
const apiResponse = require('../utils/apiResponse');
const { ApiError } = require('../middlewares/errorHandler');

/**
 * GET /api/users
 * List all users (Admin only)
 */
const getUsers = async (req, res, next) => {
    try {
        // Double check levelRole just in case, though route middleware should handle it
        if (req.user.levelRole !== 0) {
            throw new ApiError(403, 'Akses ditolak. Hanya admin yang bisa melihat daftar user.');
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const { count, rows: users } = await User.findAndCountAll({
            limit,
            offset,
            attributes: ['id', 'username', 'status', 'level_role', 'created_at', 'updated_at'],
            include: [
                {
                    model: Website,
                    as: 'websites',
                    attributes: ['id', 'name', 'slug', 'url', 'logo', 'status'],
                }
            ]
        });

        const pagination = {
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            limit: limit
        };

        apiResponse.success(res, { users, pagination }, 'Berhasil mengambil daftar user');
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/users/:id
 * Get user detail by ID (Admin only)
 */
const getUserById = async (req, res, next) => {
    try {
        if (req.user.levelRole !== 0) {
            throw new ApiError(403, 'Akses ditolak. Hanya admin yang bisa melihat detail user.');
        }

        const { id } = req.params;
        const user = await User.findByPk(id, {
            attributes: ['id', 'username', 'status', 'level_role', 'created_at', 'updated_at'],
            include: [
                {
                    model: Website,
                    as: 'websites',
                    attributes: ['id', 'name', 'slug', 'url', 'logo', 'status'],
                }
            ]
        });

        if (!user) {
            throw new ApiError(404, 'User tidak ditemukan');
        }

        apiResponse.success(res, user, 'Berhasil mengambil detail user');
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/users
 * Create new user (Admin only)
 */
const createUser = async (req, res, next) => {
    try {
        if (req.user.levelRole !== 0) {
            throw new ApiError(403, 'Hanya admin yang dapat menambahkan user baru');
        }

        const { username, password, status, levelRole } = req.body;

        if (!username || !password) {
            throw new ApiError(400, 'Username dan password wajib diisi');
        }

        if (password.length < 6) {
            throw new ApiError(400, 'Password minimal 6 karakter');
        }

        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            throw new ApiError(409, 'Username sudah digunakan');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            password: hashedPassword,
            status: status !== undefined ? status : true,
            levelRole: levelRole !== undefined ? levelRole : 1, // Default user biasa
        });

        apiResponse.success(res, {
            id: user.id,
            username: user.username,
            status: user.status,
            levelRole: user.levelRole,
        }, 'User berhasil ditambahkan', 201);
    } catch (err) {
        next(err);
    }
};

/**
 * PUT /api/users/:id
 * Update user (Admin only)
 */
const updateUser = async (req, res, next) => {
    try {
        if (req.user.levelRole !== 0) {
            throw new ApiError(403, 'Hanya admin yang dapat mengubah data user');
        }

        const { id } = req.params;
        const { username, password, status, levelRole } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            throw new ApiError(404, 'User tidak ditemukan');
        }

        // Jika username diubah, cek duplikat
        if (username && username !== user.username) {
            const existingUser = await User.findOne({ where: { username } });
            if (existingUser) {
                throw new ApiError(409, 'Username sudah digunakan');
            }
            user.username = username;
        }

        // Jika password diubah
        if (password) {
            if (password.length < 6) {
                throw new ApiError(400, 'Password minimal 6 karakter');
            }
            user.password = await bcrypt.hash(password, 10);
        }

        if (status !== undefined) user.status = status;
        if (levelRole !== undefined) user.levelRole = levelRole;

        await user.save();

        apiResponse.success(res, {
            id: user.id,
            username: user.username,
            status: user.status,
            levelRole: user.levelRole,
        }, 'User berhasil diperbarui');
    } catch (err) {
        next(err);
    }
};

/**
 * DELETE /api/users/:id
 * Delete user (Admin only)
 */
const deleteUser = async (req, res, next) => {
    try {
        if (req.user.levelRole !== 0) {
            throw new ApiError(403, 'Hanya admin yang dapat menghapus user');
        }

        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            throw new ApiError(404, 'User tidak ditemukan');
        }

        // Prevent admin deleting themselves (optional but recommended)
        if (user.id === req.user.id) {
            throw new ApiError(400, 'Tidak dapat menghapus akun sendiri');
        }

        await user.destroy();

        apiResponse.success(res, null, 'User berhasil dihapus');
    } catch (err) {
        next(err);
    }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };
