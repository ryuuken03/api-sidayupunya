const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
    },
    discountPercent: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
        field: 'discount_percent',
    },
    discountAmount: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
        field: 'discount_amount',
    },
    image: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    hasStock: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'has_stock',
    },
    websiteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'website_id',
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, {
    tableName: 'products',
    timestamps: true,
    underscored: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
});

module.exports = Product;
