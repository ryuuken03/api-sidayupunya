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

        const products = await Product.findAll({
            include: [{
                model: Website,
                as: 'website',
                attributes: ['id', 'slug', 'name'],
            }],
            order: [['created_at', 'DESC']],
        });

        apiResponse.success(res, products, 'Daftar semua produk');
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/websites/:websiteSlug/products (public)
 */
const getAll = async (req, res, next) => {
    try {
        const website = await Website.findOne({
            where: { slug: req.params.websiteSlug },
        });

        if (!website) {
            throw new ApiError(404, 'Website tidak ditemukan');
        }

        const products = await Product.findAll({
            where: { websiteId: website.id },
        });

        apiResponse.success(res, products, 'Daftar produk');
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
                attributes: ['id', 'slug', 'name'],
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

        if (!name) {
            throw new ApiError(400, 'Nama produk wajib diisi');
        }

        if (!websiteId) {
            throw new ApiError(400, 'Website ID wajib diisi');
        }

        // Verify website belongs to user (admin bypass)
        const whereWebsite = { id: websiteId };
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

        const { name, description, price, discountPercent, discountAmount, hasStock, status } = req.body;

        if (name && name !== product.name) {
            const newSlug = generateSlug(name);
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
