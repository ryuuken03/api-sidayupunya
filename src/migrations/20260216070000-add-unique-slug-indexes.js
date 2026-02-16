'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.addIndex('websites', ['slug'], {
            unique: true,
            name: 'websites_slug_unique',
        });

        await queryInterface.addIndex('products', ['slug'], {
            unique: true,
            name: 'products_slug_unique',
        });
    },

    async down(queryInterface) {
        await queryInterface.removeIndex('websites', 'websites_slug_unique');
        await queryInterface.removeIndex('products', 'products_slug_unique');
    },
};
