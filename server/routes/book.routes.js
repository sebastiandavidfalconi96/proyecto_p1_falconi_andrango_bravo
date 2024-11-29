const express = require('express');
const bookController = require('../controllers/book.controller');

const router = express.Router();

router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.post('/', bookController.createBook);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);
router.post('/:id/rent', bookController.rentBook);
router.post('/:id/return', bookController.returnBook);

module.exports = router;
