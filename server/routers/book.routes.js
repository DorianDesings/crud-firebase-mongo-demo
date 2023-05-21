const express = require('express');
const bookRoutes = express.Router();
const controller = require('../controllers/book.controller');

// Obtener un usuario por ID
bookRoutes.get('/', controller.getAllBooks);

module.exports = bookRoutes;
