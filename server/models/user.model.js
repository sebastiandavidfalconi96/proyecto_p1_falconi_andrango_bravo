const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); 

const User = sequelize.define('User', {
  id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userType: {
    type: DataTypes.ENUM('admin', 'creator', 'consumer'),
    allowNull: false,
  },
}, {
  tableName: 'users',  // Asegúrate de que sea el mismo nombre que tu tabla
  timestamps: true,
});

module.exports = User;
