const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const { Analytic, Website, Product } = require('../models');
const apiResponse = require('../utils/apiResponse');
const { ApiError } = require('../middlewares/errorHandler');

/**
 * POST /api/analytics/track
 * Record an event (PUBLIC — no auth, dipanggil dari frontend pengunjung)
 */
const trackEvent = async (req, res, next) => {
    try {
        const { eventType, websiteId, productId } = req.body;

        const validTypes = ['page_view', 'product_view', 'cta_page_click', 'cta_product_click'];
        if (!eventType || !validTypes.includes(eventType)) {
            throw new ApiError(400, `event_type harus salah satu dari: ${validTypes.join(', ')}`);
        }

        if (!websiteId) {
            throw new ApiError(400, 'website_id wajib diisi');
        }

        // Verify website exists
        const website = await Website.findByPk(websiteId);
        if (!website) {
            throw new ApiError(404, 'Website tidak ditemukan');
        }

        // product_id required for product-related events
        if ((eventType === 'product_view' || eventType === 'cta_product_click') && !productId) {
            throw new ApiError(400, 'product_id wajib diisi untuk event produk');
        }

        if (productId) {
            const product = await Product.findByPk(productId);
            if (!product) {
                throw new ApiError(404, 'Produk tidak ditemukan');
            }
        }

        const analytic = await Analytic.create({
            eventType,
            websiteId,
            productId: productId || null,
            visitorIp: req.ip || req.connection.remoteAddress || '0.0.0.0',
            userAgent: req.headers['user-agent'] || 'unknown',
            referer: req.headers['referer'] || null,
        });

        apiResponse.success(res, { id: analytic.id }, 'Event recorded', 201);
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/analytics/summary/:websiteSlug
 * Summary stats for a website (AUTH — hanya pemilik website)
 */
const getSummary = async (req, res, next) => {
    try {
        const website = await Website.findOne({
            where: { slug: req.params.websiteSlug, userId: req.user.id },
        });

        if (!website) {
            throw new ApiError(404, 'Website tidak ditemukan');
        }

        const { startDate, endDate } = req.query;
        const dateFilter = {};
        if (startDate) dateFilter[Op.gte] = new Date(startDate);
        if (endDate) dateFilter[Op.lte] = new Date(endDate);

        const where = { websiteId: website.id };
        if (startDate || endDate) where.created_at = dateFilter;

        const [pageViews, productViews, ctaPageClicks, ctaProductClicks, uniqueVisitors] = await Promise.all([
            Analytic.count({ where: { ...where, eventType: 'page_view' } }),
            Analytic.count({ where: { ...where, eventType: 'product_view' } }),
            Analytic.count({ where: { ...where, eventType: 'cta_page_click' } }),
            Analytic.count({ where: { ...where, eventType: 'cta_product_click' } }),
            Analytic.count({ where, distinct: true, col: 'visitor_ip' }),
        ]);

        apiResponse.success(res, {
            websiteSlug: website.slug,
            websiteName: website.name,
            period: {
                startDate: startDate || null,
                endDate: endDate || null,
            },
            pageViews,
            productViews,
            ctaPageClicks,
            ctaProductClicks,
            totalEvents: pageViews + productViews + ctaPageClicks + ctaProductClicks,
            uniqueVisitors,
        }, 'Ringkasan analitik');
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/analytics/daily/:websiteSlug
 * Daily breakdown for a website (AUTH)
 */
const getDailyStats = async (req, res, next) => {
    try {
        const website = await Website.findOne({
            where: { slug: req.params.websiteSlug, userId: req.user.id },
        });

        if (!website) {
            throw new ApiError(404, 'Website tidak ditemukan');
        }

        const { startDate, endDate, eventType } = req.query;
        const where = { websiteId: website.id };

        if (startDate || endDate) {
            where.created_at = {};
            if (startDate) where.created_at[Op.gte] = new Date(startDate);
            if (endDate) where.created_at[Op.lte] = new Date(endDate);
        }

        if (eventType) where.eventType = eventType;

        const dailyStats = await Analytic.findAll({
            where,
            attributes: [
                [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
                'event_type',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
            ],
            group: [sequelize.fn('DATE', sequelize.col('created_at')), 'event_type'],
            order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'DESC']],
            raw: true,
        });

        apiResponse.success(res, dailyStats, 'Statistik harian');
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/analytics/top-products/:websiteSlug
 * Top products by views/clicks (AUTH)
 */
const getTopProducts = async (req, res, next) => {
    try {
        const website = await Website.findOne({
            where: { slug: req.params.websiteSlug, userId: req.user.id },
        });

        if (!website) {
            throw new ApiError(404, 'Website tidak ditemukan');
        }

        const { limit = 10, eventType = 'product_view' } = req.query;

        const topProducts = await Analytic.findAll({
            where: {
                websiteId: website.id,
                eventType,
                productId: { [Op.not]: null },
            },
            attributes: [
                'product_id',
                [sequelize.fn('COUNT', sequelize.col('Analytic.id')), 'count'],
            ],
            include: [{
                model: Product,
                as: 'product',
                attributes: ['id', 'slug', 'name', 'price'],
            }],
            group: ['product_id', 'product.id'],
            order: [[sequelize.fn('COUNT', sequelize.col('Analytic.id')), 'DESC']],
            limit: parseInt(limit),
            raw: false,
        });

        apiResponse.success(res, topProducts, 'Produk terpopuler');
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/analytics/events/:websiteSlug
 * Raw event list with pagination (AUTH)
 */
const getEvents = async (req, res, next) => {
    try {
        const website = await Website.findOne({
            where: { slug: req.params.websiteSlug, userId: req.user.id },
        });

        if (!website) {
            throw new ApiError(404, 'Website tidak ditemukan');
        }

        const { page = 1, limit = 20, eventType } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        const where = { websiteId: website.id };
        if (eventType) where.eventType = eventType;

        const { rows, count } = await Analytic.findAndCountAll({
            where,
            include: [{
                model: Product,
                as: 'product',
                attributes: ['id', 'slug', 'name'],
            }],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset,
        });

        apiResponse.success(res, {
            events: rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalItems: count,
                totalPages: Math.ceil(count / parseInt(limit)),
            },
        }, 'Daftar event');
    } catch (err) {
        next(err);
    }
};

module.exports = { trackEvent, getSummary, getDailyStats, getTopProducts, getEvents };
