// controllers/user.controller.js
const userService = require('../services/user.service');

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users); // Los usuarios ya vienen formateados como DTOs
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user); // El usuario ya está formateado como DTO
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    if (!updatedUser) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const suspendUser = async (req, res) => {
  try {
    const { justification } = req.body;  // Recibir la justificación desde el cuerpo de la solicitud
    const suspendedUser = await userService.suspendUser(req.params.id, justification);
    res.json(suspendedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const reactivateUser = async (req, res) => {
  try {
    const reactivatedUser = await userService.reactivateUser(req.params.id);
    res.json(reactivatedUser);  // Devolver el usuario reactivado
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await userService.deleteUser(req.params.id);
    res.json(deletedUser);  // Devuelve el usuario con estado 'inactivo'
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  suspendUser,
  reactivateUser,
};
