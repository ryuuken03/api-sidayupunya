const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProductCategoryMap = sequelize.define('ProductCategoryMap', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    idProduct: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_product',
    },
    idProductCategory: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_product_category',
    },
}, {
    tableName: 'product_category_maps',
    timestamps: true,
    underscored: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
});

module.exports = ProductCategoryMap;
