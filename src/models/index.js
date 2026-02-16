const User = require('./User');
const Token = require('./Token');
const Website = require('./Website');
const Product = require('./Product');
const Analytic = require('./Analytic');

// Associations
User.hasMany(Website, { foreignKey: 'user_id', as: 'websites', onDelete: 'CASCADE' });
Website.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Website.hasMany(Product, { foreignKey: 'website_id', as: 'products', onDelete: 'CASCADE' });
Product.belongsTo(Website, { foreignKey: 'website_id', as: 'website' });

Website.hasMany(Analytic, { foreignKey: 'website_id', as: 'analytics', onDelete: 'CASCADE' });
Analytic.belongsTo(Website, { foreignKey: 'website_id', as: 'website' });

Product.hasMany(Analytic, { foreignKey: 'product_id', as: 'analytics', onDelete: 'CASCADE' });
Analytic.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

module.exports = { User, Token, Website, Product, Analytic };
