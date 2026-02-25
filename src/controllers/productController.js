const { Website, Product } = require('../models');
const apiResponse = require('../utils/apiResponse');
const { ApiError } = require('../middlewares/errorHandler');
const fs = require('fs');
const path = require('path');

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
 * Verify product belongs to user (via website), admin bypass
 */
const verifyProductOwnership = async (productSlug, userId, levelRole) => {
    const product = await Product.findOne({
        where: { slug: productSlug },
        include: [{
            model: Website,
            as: 'website',
            attributes: ['id', 'slug', 'userId'],
        }],
    });

    if (!product) {
        throw new ApiError(404, 'Produk tidak ditemukan');
    }

    if (levelRole !== 0 && product.website.userId !== userId) {
        throw new ApiError(403, 'Anda tidak memiliki akses ke produk ini');
    }

    return product;
};

/**
 * GET /api/websites/:websiteSlug/products (public)
 */


/**
 * GET /api/products
 * List all products (Admin only)
 */
const getAllForAdmin = async (req, res, next) => {
    try {
        if (req.user.levelRole !== 0) {
            throw new ApiError(403, 'Hanya admin yang dapat melihat semua produk');
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const { count, rows: products } = await Product.findAndCountAll({
            limit,
            offset,
            include: [{
                model: Website,
                as: 'website',
                attributes: ['id', 'slug', 'name', 'logo'],
            }],
            order: [['created_at', 'DESC']],
        });

        const pagination = {
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            limit: limit
        };

        apiResponse.success(res, { products, pagination }, 'Daftar semua produk');
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/websites/:websiteSlug/products (public)
 */
const getAll = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const website = await Website.findOne({
            where: { slug: req.params.websiteSlug },
        });

        if (!website) {
            throw new ApiError(404, 'Website tidak ditemukan');
        }

        const { count, rows: products } = await Product.findAndCountAll({
            where: { websiteId: website.id },
            limit,
            offset,
            include: [{
                model: Website,
                as: 'website',
                attributes: ['id', 'slug', 'name', 'logo'],
            }],
        });

        const pagination = {
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            limit: limit
        };

        apiResponse.success(res, { products, pagination }, 'Daftar produk');
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/products/:slug (public)
 */
const getBySlug = async (req, res, next) => {
    try {
        const product = await Product.findOne({
            where: { slug: req.params.slug },
            include: [{
                model: Website,
                as: 'website',
                attributes: ['id', 'slug', 'name', 'logo'],
            }],
        });

        if (!product) {
            throw new ApiError(404, 'Produk tidak ditemukan');
        }

        apiResponse.success(res, product);
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/products
 */
const create = async (req, res, next) => {
    try {
        const { name, description, price, discountPercent, discountAmount, hasStock, websiteId } = req.body;
        let image = req.body.image;

        if (req.file) {
            image = `${req.protocol}://${req.get('host')}/public/uploads/products/${req.params.websiteSlug}/${req.file.filename}`;
        }

        if (!name) {
            throw new ApiError(400, 'Nama produk wajib diisi');
        }

        // Verify website belongs to user (admin bypass)
        const whereWebsite = { slug: req.params.websiteSlug };
        if (req.user.levelRole !== 0) whereWebsite.userId = req.user.id;

        const website = await Website.findOne({ where: whereWebsite });
        if (!website) {
            throw new ApiError(404, 'Website tidak ditemukan');
        }

        const slug = generateSlug(name);

        const existingSlug = await Product.findOne({ where: { slug } });
        if (existingSlug) {
            throw new ApiError(409, 'Slug produk sudah digunakan, gunakan nama lain');
        }

        const product = await Product.create({
            slug,
            name,
            description: description || null,
            price: price || 0,
            discountPercent: discountPercent || null,
            discountAmount: discountAmount || null,
            hasStock: hasStock !== undefined ? hasStock : true,
            image: image || null,
            websiteId: website.id,
            status: true,
        });

        apiResponse.success(res, product, 'Produk berhasil dibuat', 201);
    } catch (err) {
        next(err);
    }
};

/**
 * PUT /api/products/:slug
 */
const update = async (req, res, next) => {
    try {
        const product = await verifyProductOwnership(req.params.slug, req.user.id, req.user.levelRole);

        const { name, description, price, discountPercent, discountAmount, hasStock, status, websiteId } = req.body;
        let image = req.body.image;

        if (req.file) {
            image = `${req.protocol}://${req.get('host')}/public/uploads/products/${req.params.websiteSlug}/${req.file.filename}`;
        }

        let newSlug = product.slug;
        if (name && name !== product.name) {
            newSlug = generateSlug(name);
            const existingSlug = await Product.findOne({ where: { slug: newSlug } });
            if (existingSlug && existingSlug.id !== product.id) {
                throw new ApiError(409, 'Slug produk sudah digunakan, gunakan nama lain');
            }
            product.slug = newSlug;
            product.name = name;
        }

        if (description !== undefined) product.description = description;
        if (price !== undefined) product.price = price;
        if (discountPercent !== undefined) product.discountPercent = discountPercent;
        if (discountAmount !== undefined) product.discountAmount = discountAmount;
        if (hasStock !== undefined) product.hasStock = hasStock;
        if (image !== undefined) product.image = image;
        if (status !== undefined) product.status = status;

        await product.save();

        apiResponse.success(res, product, 'Produk berhasil diperbarui');
    } catch (err) {
        next(err);
    }
};

/**
 * DELETE /api/products/:slug
 */
const remove = async (req, res, next) => {
    try {
        const product = await verifyProductOwnership(req.params.slug, req.user.id, req.user.levelRole);

        await product.destroy();

        apiResponse.success(res, null, 'Produk berhasil dihapus');
    } catch (err) {
        next(err);
    }
};

module.exports = { getAll, getAllForAdmin, getBySlug, create, update, remove };
