'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('users', 'level_role', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1,
            after: 'status',
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('users', 'level_role');
    },
};
