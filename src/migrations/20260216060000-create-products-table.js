'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('products', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            slug: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            price: {
                type: Sequelize.DOUBLE,
                defaultValue: 0,
            },
            discount_percent: {
                type: Sequelize.DOUBLE,
                defaultValue: null,
                allowNull: true,
            },
            discount_amount: {
                type: Sequelize.DOUBLE,
                defaultValue: null,
                allowNull: true,
            },
            has_stock: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            website_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'websites',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            status: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
            },
            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('products');
    },
};
