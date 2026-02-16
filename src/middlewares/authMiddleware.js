const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config');
const { ApiError } = require('./errorHandler');

/**
 * Auth middleware — verifies JWT from Authorization header
 * Usage: router.get('/protected', authMiddleware, controller)
 */
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError(401, 'Token tidak ditemukan');
        }

        const token = authHeader.split(' ')[1];

        // Verify JWT
        const decoded = jwt.verify(token, config.jwt.secret);

        // Check if user still exists & active
        const user = await User.findByPk(decoded.id);
        if (!user) {
            throw new ApiError(401, 'User tidak ditemukan');
        }

        if (!user.status) {
            throw new ApiError(403, 'Akun tidak aktif');
        }

        // Attach user to request
        req.user = {
            id: user.id,
            username: user.username,
            status: user.status,
        };

        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return next(new ApiError(401, 'Token tidak valid'));
        }
        if (err.name === 'TokenExpiredError') {
            return next(new ApiError(401, 'Token sudah expired'));
        }
        next(err);
    }
};

module.exports = authMiddleware;
