const { ProductCategory } = require('../models');
const { Op } = require('sequelize');
const apiResponse = require('../utils/apiResponse');
const { ApiError } = require('../middlewares/errorHandler');

/**
 * Generate slug from name
 */
const generateSlug = (name) => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

/**
 * GET /api/product-categories
 */
const getAll = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        const search = req.query.search || '';

        const whereCondition = {};
        if (search) {
            whereCondition.name = {
                [Op.like]: `%${search}%`
            };
        }

        const { count, rows: categories } = await ProductCategory.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
            order: [['created_at', 'DESC']],
        });

        const pagination = {
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            limit: limit
        };

        apiResponse.success(res, { categories, pagination }, 'Daftar semua kategori produk');
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/product-categories/:idOrSlug
 */
const getDetail = async (req, res, next) => {
    try {
        const { idOrSlug } = req.params;
        let whereCondition = {};

        // Cek parameter: jika hanya berisi angka, maka cari berdasarkan ID, selain itu berasumsi berupa slug.
        if (/^\d+$/.test(idOrSlug)) {
            whereCondition.id = idOrSlug;
        } else {
            whereCondition.slug = idOrSlug;
        }

        const category = await ProductCategory.findOne({ where: whereCondition });

        if (!category) {
            throw new ApiError(404, 'Kategori produk tidak ditemukan');
        }

        apiResponse.success(res, category, 'Detail kategori produk');
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/product-categories
 */
const create = async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name) {
            throw new ApiError(400, 'Nama kategori wajib diisi');
        }

        const slug = generateSlug(name);

        const existingCategory = await ProductCategory.findOne({ where: { slug } });
        if (existingCategory) {
            throw new ApiError(409, 'Kategori dengan nama (slug) ini sudah digunakan, gunakan nama lain');
        }

        const category = await ProductCategory.create({ name, slug });

        apiResponse.success(res, category, 'Kategori produk berhasil dibuat', 201);
    } catch (err) {
        next(err);
    }
};

/**
 * PUT /api/product-categories/:idOrSlug
 */
const update = async (req, res, next) => {
    try {
        const { idOrSlug } = req.params;
        const { name } = req.body;

        let whereCondition = {};
        if (/^\d+$/.test(idOrSlug)) {
            whereCondition.id = idOrSlug;
        } else {
            whereCondition.slug = idOrSlug;
        }

        const category = await ProductCategory.findOne({ where: whereCondition });

        if (!category) {
            throw new ApiError(404, 'Kategori produk tidak ditemukan');
        }

        if (name && name !== category.name) {
            const newSlug = generateSlug(name);
            const existingSlug = await ProductCategory.findOne({ where: { slug: newSlug } });

            if (existingSlug && existingSlug.id !== category.id) {
                throw new ApiError(409, 'Kategori dengan nama (slug) ini sudah digunakan, gunakan nama lain');
            }
            category.name = name;
            category.slug = newSlug;
        }

        await category.save();

        apiResponse.success(res, category, 'Kategori produk berhasil diperbarui');
    } catch (err) {
        next(err);
    }
};

/**
 * DELETE /api/product-categories/:idOrSlug
 */
const remove = async (req, res, next) => {
    try {
        const { idOrSlug } = req.params;

        let whereCondition = {};
        if (/^\d+$/.test(idOrSlug)) {
            whereCondition.id = idOrSlug;
        } else {
            whereCondition.slug = idOrSlug;
        }

        const category = await ProductCategory.findOne({ where: whereCondition });

        if (!category) {
            throw new ApiError(404, 'Kategori produk tidak ditemukan');
        }

        await category.destroy();

        apiResponse.success(res, null, 'Kategori produk berhasil dihapus');
    } catch (err) {
        next(err);
    }
};

module.exports = { getAll, getDetail, create, update, remove };
