'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('websites', 'can_access', {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            after: 'status',
        });

        await queryInterface.addColumn('websites', 'description', {
            type: Sequelize.TEXT,
            allowNull: true,
            after: 'can_access',
        });

        await queryInterface.addColumn('websites', 'subdomain', {
            type: Sequelize.STRING(50),
            allowNull: true,
            after: 'description',
        });

        await queryInterface.addColumn('websites', 'can_expired', {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
            after: 'subdomain',
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('websites', 'can_access');
        await queryInterface.removeColumn('websites', 'description');
        await queryInterface.removeColumn('websites', 'subdomain');
        await queryInterface.removeColumn('websites', 'can_expired');
    },
};
