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
            level_role: user.levelRole,
            token,
        }, 'Login berhasil');
    } catch (err) {
        next(err);
    }
};

module.exports = { login };
