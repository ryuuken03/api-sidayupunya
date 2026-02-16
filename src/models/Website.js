const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Website = sequelize.define('Website', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    phone: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    lat: {
        type: DataTypes.DOUBLE,
        allowNull: true,
    },
    lng: {
        type: DataTypes.DOUBLE,
        allowNull: true,
    },
    address: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    logo: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
    },
    url: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    canAccess: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'can_access',
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    subdomain: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    canExpired: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'can_expired',
    },
    hasProduct: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'has_product',
    },
}, {
    tableName: 'websites',
    timestamps: true,
    underscored: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
});

module.exports = Website;
