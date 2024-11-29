const express = require('express');
const userController = require('../controllers/user.controller');
const userService = require('../services/user.service');
const { User } = require('../models');
const bcrypt = require('bcrypt');

const router = express.Router();

// Rutas específicas primero
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Por favor, proporciona ambos el correo y la contraseña.',
        });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado.',
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Contraseña incorrecta.',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Inicio de sesión exitoso.',
            user: { id: user.id, email: user.email },
            // Aquí puedes devolver un token JWT si es necesario
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Error al verificar el usuario.',
        });
    }
});

// Rutas generales después
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
