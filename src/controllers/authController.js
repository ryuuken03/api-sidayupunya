const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const apiResponse = require('../utils/apiResponse');
const { ApiError } = require('../middlewares/errorHandler');
const config = require('../config');

/**
 * Generate JWT token
 */
const generateToken = (user) => {
    const payload = {
        id: user.id,
        username: user.username,
        status: user.status,
        levelRole: user.levelRole,
    };

    return jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
    });
};

/**
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
    try {
        // Hanya user dengan level_role = 0 yang bisa register user baru
        if (req.user.levelRole !== 0) {
            throw new ApiError(403, 'Hanya admin yang dapat menambahkan user baru');
        }

        const { username, password } = req.body;

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
            status: true,
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
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            throw new ApiError(400, 'Username dan password wajib diisi');
        }

        const user = await User.findOne({ where: { username } });
        if (!user) {
            throw new ApiError(401, 'Username atau password salah');
        }

        if (!user.status) {
            throw new ApiError(403, 'Akun tidak aktif');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new ApiError(401, 'Username atau password salah');
        }

        const token = generateToken(user);

        apiResponse.success(res, {
            username: user.username,
            status: user.status,
            token,
        }, 'Login berhasil');
    } catch (err) {
        next(err);
    }
};

module.exports = { register, login };
