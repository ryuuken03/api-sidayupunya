const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Antigravity API',
            version: '1.0.0',
            description: 'API Backend untuk Antigravity — Node.js + Express + Sequelize + MySQL',
        },
        servers: [
            {
                url: '/api',
                description: 'API Base URL',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
