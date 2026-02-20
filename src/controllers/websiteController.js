const { Website, User } = require('../models');
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
 * GET /api/websites
 * List all websites owned by the authenticated user
 */
const getAll = async (req, res, next) => {
    try {
        const where = {};
        // Jika bukan admin (levelRole !== 0), hanya tampilkan milik user sendiri
        if (req.user.levelRole !== 0) {
            where.userId = req.user.id;
        }

        const websites = await Website.findAll({
            where,
            attributes: ['id', 'slug', 'name', 'phone', 'lat', 'lng', 'address', 'logo', 'url', 'status', 'can_access', 'description', 'subdomain', 'can_expired', 'has_product', 'created_at', 'updated_at'],
        });

        apiResponse.success(res, websites, 'Daftar website');
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/websites/:slug
 * Get a single website by slug (public)
 */
const getBySlug = async (req, res, next) => {
    try {
        const website = await Website.findOne({
            where: { slug: req.params.slug },
            attributes: ['id', 'slug', 'name', 'phone', 'lat', 'lng', 'address', 'logo', 'url', 'status', 'can_access', 'description', 'subdomain', 'can_expired', 'has_product', 'created_at', 'updated_at'],
        });

        if (!website) {
            throw new ApiError(404, 'Website tidak ditemukan');
        }

        apiResponse.success(res, website);
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/websites
 * Create a new website
 */
const create = async (req, res, next) => {
    try {
        const { name, phone, lat, lng, address, url, description, subdomain } = req.body;
        let logo = req.body.logo;

        if (req.file) {
            logo = `${req.protocol}://${req.get('host')}/public/uploads/logos/${req.file.filename}`;
        }

        if (!name || !url) {
            throw new ApiError(400, 'Nama website dan URL wajib diisi');
        }

        const slug = generateSlug(name);

        const existingSlug = await Website.findOne({ where: { slug } });
        if (existingSlug) {
            throw new ApiError(409, 'Slug website sudah digunakan, gunakan nama lain');
        }

        const website = await Website.create({
            slug,
            name,
            phone: phone || null,
            lat: lat || null,
            lng: lng || null,
            address: address || null,
            logo: logo || null,
            userId: req.user.id,
            url,
            status: true,
            canAccess: true,
            description: description || null,
            subdomain: subdomain || null,
            canExpired: true,
            hasProduct: false,
        });

        apiResponse.success(res, {
            id: website.id,
            slug: website.slug,
            name: website.name,
            phone: website.phone,
            lat: website.lat,
            lng: website.lng,
            address: website.address,
            logo: website.logo,
            url: website.url,
            status: website.status,
            canAccess: website.canAccess,
            description: website.description,
            subdomain: website.subdomain,
            canExpired: website.canExpired,
            hasProduct: website.hasProduct,
        }, 'Website berhasil dibuat', 201);
    } catch (err) {
        next(err);
    }
};

/**
 * PUT /api/websites/:slug
 * Update a website
 */
const update = async (req, res, next) => {
    try {
        const where = { slug: req.params.slug };
        if (req.user.levelRole !== 0) where.userId = req.user.id;

        const website = await Website.findOne({ where });

        if (!website) {
            throw new ApiError(404, 'Website tidak ditemukan');
        }

        const { name, phone, lat, lng, address, url, status, canAccess, description, subdomain, canExpired, hasProduct } = req.body;
        let logo = req.body.logo;

        if (req.file) {
            logo = `${req.protocol}://${req.get('host')}/public/uploads/logos/${req.file.filename}`;
        }

        // Re-generate slug if name changed
        if (name && name !== website.name) {
            const newSlug = generateSlug(name);
            const existingSlug = await Website.findOne({ where: { slug: newSlug } });
            if (existingSlug && existingSlug.id !== website.id) {
                throw new ApiError(409, 'Slug website sudah digunakan, gunakan nama lain');
            }
            website.slug = newSlug;
            website.name = name;
        }

        if (phone !== undefined) website.phone = phone;
        if (lat !== undefined) website.lat = lat;
        if (lng !== undefined) website.lng = lng;
        if (address !== undefined) website.address = address;
        if (logo !== undefined) website.logo = logo;
        if (url !== undefined) website.url = url;
        if (status !== undefined) website.status = status;
        if (canAccess !== undefined) website.canAccess = canAccess;
        if (description !== undefined) website.description = description;
        if (subdomain !== undefined) website.subdomain = subdomain;
        if (canExpired !== undefined) website.canExpired = canExpired;
        if (hasProduct !== undefined) website.hasProduct = hasProduct;

        await website.save();

        apiResponse.success(res, {
            id: website.id,
            slug: website.slug,
            name: website.name,
            phone: website.phone,
            lat: website.lat,
            lng: website.lng,
            address: website.address,
            logo: website.logo,
            url: website.url,
            status: website.status,
            canAccess: website.canAccess,
            description: website.description,
            subdomain: website.subdomain,
            canExpired: website.canExpired,
        }, 'Website berhasil diperbarui');
    } catch (err) {
        next(err);
    }
};

/**
 * DELETE /api/websites/:slug
 * Soft delete a website
 */
const remove = async (req, res, next) => {
    try {
        const where = { slug: req.params.slug };
        if (req.user.levelRole !== 0) where.userId = req.user.id;

        const website = await Website.findOne({ where });

        if (!website) {
            throw new ApiError(404, 'Website tidak ditemukan');
        }

        await website.destroy(); // Soft delete (paranoid)

        apiResponse.success(res, null, 'Website berhasil dihapus');
    } catch (err) {
        next(err);
    }
};

module.exports = { getAll, getBySlug, create, update, remove };
