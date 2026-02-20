const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();

// --------------- Middleware ---------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/public', express.static(path.join(__dirname, '../public')));

// --------------- Swagger Docs ---------------
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --------------- Routes ---------------
app.use('/api', routes);

// --------------- Error Handling ---------------
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
