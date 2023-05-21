const express = require('express');
const userRoutes = express.Router();
const controller = require('../controllers/user.controller');

// Obtener un usuario por ID
userRoutes.get('/', controller.getAllUsers);

userRoutes.get('/:id', controller.userById);

// Crear un usuario
userRoutes.post('/', controller.createUser);

module.exports = userRoutes;
