const express = require('express');
const bookController = require('../controllers/book.controller');

const router = express.Router();
router.get('/search', bookController.searchBooks); // Para búsqueda por título o filtro por categoría
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById); // Dejar esta línea después de las rutas específicas
router.post('/', bookController.createBook);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);
router.post('/:id/rent', bookController.rentBook);
router.post('/:id/return', bookController.returnBook);
router.get('/availability/:id', bookController.checkBookAvailability); // Para consulta de disponibilidad por ID

module.exports = router;
