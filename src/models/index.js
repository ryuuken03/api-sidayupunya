const User = require('./User');
const Token = require('./Token');
const Website = require('./Website');
const Product = require('./Product');

// Associations
User.hasMany(Website, { foreignKey: 'user_id', as: 'websites', onDelete: 'CASCADE' });
Website.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Website.hasMany(Product, { foreignKey: 'website_id', as: 'products', onDelete: 'CASCADE' });
Product.belongsTo(Website, { foreignKey: 'website_id', as: 'website' });

module.exports = { User, Token, Website, Product };
