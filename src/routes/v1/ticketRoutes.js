const express = require('express');
const router = express.Router();
const ticketController = require('../../controllers/ticketController');

router.get('/:usuarioId', ticketController.getTicketsByUser);

module.exports = router;
