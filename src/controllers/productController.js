const { Website, Product } = require('../models');
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
 * Verify website belongs to user
 */
const verifyWebsite = async (websiteId, userId) => {
    const website = await Website.findOne({ where: { id: websiteId, userId } });
    if (!website) {
        throw new ApiError(404, 'Website tidak ditemukan');
    }
    return website;
};

/**
 * GET /api/websites/:websiteId/products
 */
const getAll = async (req, res, next) => {
    try {
        await verifyWebsite(req.params.websiteId, req.user.id);

        const products = await Product.findAll({
            where: { websiteId: req.params.websiteId },
        });

        apiResponse.success(res, products, 'Daftar produk');
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/websites/:websiteId/products/:id
 */
const getById = async (req, res, next) => {
    try {
        await verifyWebsite(req.params.websiteId, req.user.id);

        const product = await Product.findOne({
            where: { id: req.params.id, websiteId: req.params.websiteId },
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
 * POST /api/websites/:websiteId/products
 */
const create = async (req, res, next) => {
    try {
        await verifyWebsite(req.params.websiteId, req.user.id);

        const { name, description, price, discountPercent, discountAmount, hasStock } = req.body;

        if (!name) {
            throw new ApiError(400, 'Nama produk wajib diisi');
        }

        const slug = generateSlug(name);

        const product = await Product.create({
            slug,
            name,
            description: description || null,
            price: price || 0,
            discountPercent: discountPercent || null,
            discountAmount: discountAmount || null,
            hasStock: hasStock !== undefined ? hasStock : true,
            websiteId: req.params.websiteId,
            status: true,
        });

        apiResponse.success(res, product, 'Produk berhasil dibuat', 201);
    } catch (err) {
        next(err);
    }
};

/**
 * PUT /api/websites/:websiteId/products/:id
 */
const update = async (req, res, next) => {
    try {
        await verifyWebsite(req.params.websiteId, req.user.id);

        const product = await Product.findOne({
            where: { id: req.params.id, websiteId: req.params.websiteId },
        });

        if (!product) {
            throw new ApiError(404, 'Produk tidak ditemukan');
        }

        const { name, description, price, discountPercent, discountAmount, hasStock, status } = req.body;

        if (name && name !== product.name) {
            product.slug = generateSlug(name);
            product.name = name;
        }

        if (description !== undefined) product.description = description;
        if (price !== undefined) product.price = price;
        if (discountPercent !== undefined) product.discountPercent = discountPercent;
        if (discountAmount !== undefined) product.discountAmount = discountAmount;
        if (hasStock !== undefined) product.hasStock = hasStock;
        if (status !== undefined) product.status = status;

        await product.save();

        apiResponse.success(res, product, 'Produk berhasil diperbarui');
    } catch (err) {
        next(err);
    }
};

/**
 * DELETE /api/websites/:websiteId/products/:id
 */
const remove = async (req, res, next) => {
    try {
        await verifyWebsite(req.params.websiteId, req.user.id);

        const product = await Product.findOne({
            where: { id: req.params.id, websiteId: req.params.websiteId },
        });

        if (!product) {
            throw new ApiError(404, 'Produk tidak ditemukan');
        }

        await product.destroy();

        apiResponse.success(res, null, 'Produk berhasil dihapus');
    } catch (err) {
        next(err);
    }
};

module.exports = { getAll, getById, create, update, remove };
