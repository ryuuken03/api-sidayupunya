'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('products', 'image', {
            type: Sequelize.STRING(255),
            allowNull: true,
            after: 'discount_amount',
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('products', 'image');
    },
};
