const express = require('express');
const router = express.Router();
const { obtenerAsientosReservados } = require('../../controllers/reservationSeatsController');

router.get('/:proyeccionId', obtenerAsientosReservados);

module.exports = router;
