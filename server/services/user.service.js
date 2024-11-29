// services/user.service.js
const { User } = require('../models');
const { UserDTOBuilder } = require('../dto/user.dto');

// Crear un usuario
const createUser = async (data) => {
  const user = await User.create(data);
  return new UserDTOBuilder()
    .setId(user.id)
    .setFirstName(user.firstName)
    .setLastName(user.lastName)
    .setEmail(user.email)
    .setUserType(user.userType)
    .build();
};

// Actualizar un usuario
const updateUser = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('Usuario no encontrado');

  const updatedUser = await user.update(data);

  return new UserDTOBuilder()
    .setId(updatedUser.id)
    .setFirstName(updatedUser.firstName)
    .setLastName(updatedUser.lastName)
    .setEmail(updatedUser.email)
    .setUserType(updatedUser.userType)
    .build();
};

// Eliminar un usuario
const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('Usuario no encontrado');
  return user.destroy();
};

// Obtener un solo usuario por su ID
const getUserById = async (id) => {
  const user = await User.findByPk(id);
  if (!user) return null;

  return new UserDTOBuilder()
    .setId(user.id)
    .setFirstName(user.firstName)
    .setLastName(user.lastName)
    .setEmail(user.email)
    .setUserType(user.userType)
    .build();
};

// Obtener todos los usuarios
const getAllUsers = async () => {
  const users = await User.findAll();
  return users.map(user =>
    new UserDTOBuilder()
      .setId(user.id)
      .setFirstName(user.firstName)
      .setLastName(user.lastName)
      .setEmail(user.email)
      .setUserType(user.userType)
      .build()
  );
};

module.exports = { createUser, updateUser, deleteUser, getUserById, getAllUsers };
