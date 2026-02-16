'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('websites', 'has_product', {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            after: 'can_expired',
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('websites', 'has_product');
    },
};
