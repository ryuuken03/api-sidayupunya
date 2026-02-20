'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const hashedPassword = await bcrypt.hash('admin', 10);

        // Check if admin already exists to avoid duplicates/errors
        const adminExists = await queryInterface.rawSelect('users', {
            where: {
                username: 'admin',
            },
        }, ['id']);

        if (adminExists) {
            return;
        }

        return queryInterface.bulkInsert('users', [{
            username: 'admin',
            password: hashedPassword,
            status: true,
            level_role: 0, // 0 = Admin
            created_at: new Date(),
            updated_at: new Date()
        }]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('users', { username: 'admin' }, {});
    }
};
