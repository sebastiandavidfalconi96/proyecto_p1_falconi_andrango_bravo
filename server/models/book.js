const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isbn: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  category: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  inventoryCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isRented: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isLoaned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  location: {
    type: DataTypes.STRING,
  },
  publicationYear: {
    type: DataTypes.INTEGER,
  },
  isActive: {  // Nuevo campo para gestionar el estado del libro
    type: DataTypes.BOOLEAN,
    defaultValue: true,  // Se inicia como activo
  },
}, {
  tableName: 'books',
  timestamps: true,
});

module.exports = Book;
