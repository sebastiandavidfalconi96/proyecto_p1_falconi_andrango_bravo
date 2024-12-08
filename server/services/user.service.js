const { User } = require('../models');
const { UserDTOBuilder } = require('../dto/user.dto');
const { Op } = require('sequelize');

// Crear un usuario
const createUser = async (data) => {
  const user = await User.create(data);
  return new UserDTOBuilder()
    .setId(user.id)
    .setFirstName(user.firstName)
    .setLastName(user.lastName)
    .setEmail(user.email)
    .setUserType(user.userType)
    .setStatus(user.status)  // Agregar status
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
    .setStatus(updatedUser.status)  // Agregar status
    .build();
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
    .setStatus(user.status)  // Agregar status
    .build();
};

// Obtener todos los usuarios
const getAllUsers = async () => {
  const users = await User.findAll({
    where: {
      status: {
        [Op.not]: 'eliminado',  // Filtramos los eliminados
      },
    },
  });

  return users.map(user =>
    new UserDTOBuilder()
      .setId(user.id)
      .setFirstName(user.firstName)
      .setLastName(user.lastName)
      .setEmail(user.email)
      .setUserType(user.userType)
      .setStatus(user.status)  // Agregar status
      .build()
  );
};

// Suspender un usuario (con motivo)
const suspendUser = async (id, justification) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('Usuario no encontrado');

  user.status = 'suspendido';  // Cambiar el estado a suspendido
  user.suspensionReason = justification;  // Guardar el motivo de la suspensión
  await user.save();

  return new UserDTOBuilder()
    .setId(user.id)
    .setFirstName(user.firstName)
    .setLastName(user.lastName)
    .setEmail(user.email)
    .setUserType(user.userType)
    .setStatus(user.status)
    .build();
};

// Reactivar un usuario
const reactivateUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('Usuario no encontrado');

  user.status = 'activo';  // Cambiar el estado a activo
  user.suspensionReason = null;  // Limpiar el motivo de la suspensión
  await user.save();

  return new UserDTOBuilder()
    .setId(user.id)
    .setFirstName(user.firstName)
    .setLastName(user.lastName)
    .setEmail(user.email)
    .setUserType(user.userType)
    .setStatus(user.status)
    .build();
};

// Eliminar un usuario (cambiar el estado a 'inactivo')
const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('Usuario no encontrado');

  user.status = 'eliminado';  // Cambiar el estado a eliminado
  await user.save();

  return new UserDTOBuilder()
    .setId(user.id)
    .setFirstName(user.firstName)
    .setLastName(user.lastName)
    .setEmail(user.email)
    .setUserType(user.userType)
    .setStatus(user.status)  // Agregar status
    .build();
};

module.exports = { createUser, updateUser, deleteUser, getUserById, suspendUser, getAllUsers, suspendUser, reactivateUser };
