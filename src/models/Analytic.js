const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Analytic = sequelize.define('Analytic', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    eventType: {
        type: DataTypes.ENUM('page_view', 'product_view', 'cta_page_click', 'cta_product_click'),
        allowNull: false,
        field: 'event_type',
    },
    websiteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'website_id',
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'product_id',
    },
    visitorIp: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'visitor_ip',
    },
    userAgent: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'user_agent',
    },
    referer: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'analytics',
    timestamps: true,
    underscored: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
});

module.exports = Analytic;
