'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('websites', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            slug: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },
            name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            phone: {
                type: Sequelize.BIGINT,
                allowNull: true,
            },
            lat: {
                type: Sequelize.DOUBLE,
                allowNull: true,
            },
            lng: {
                type: Sequelize.DOUBLE,
                allowNull: true,
            },
            address: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            logo: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            url: {
                type: Sequelize.STRING(255),
                allowNull: false,
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
        await queryInterface.dropTable('websites');
    },
};
