require('dotenv').config();
const app = require('./app');
const config = require('./config');
const { sequelize, testConnection } = require('./config/database');

// Load all models (ensures associations are registered)
require('./models');

const PORT = config.port;

app.listen(PORT, async () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📡 Environment: ${config.nodeEnv}`);

    const connected = await testConnection();
    if (connected) {
        // Sync all models (creates tables if not exist)
        await sequelize.sync({ alter: false });
        console.log('📦 All models synchronized');
    }
});
