const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Token = sequelize.define('Token', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
        references: {
            model: User,
            key: 'id',
        },
    },
    token: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'expires_at',
    },
}, {
    tableName: 'tokens',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: false,       // No updated_at for tokens
});

// Associations
User.hasMany(Token, { foreignKey: 'user_id', as: 'tokens', onDelete: 'CASCADE' });
Token.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = Token;
