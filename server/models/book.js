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
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  isRented: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isLoaned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  category: {
    type: DataTypes.STRING, // Agregado para categoría
  },
  publicationYear: {
    type: DataTypes.INTEGER, // Agregado para rango de años
  },
  location: {
    type: DataTypes.STRING, // Agregado para ubicación
  },
}, {
  tableName: 'books',
  timestamps: true,
});

module.exports = Book;
