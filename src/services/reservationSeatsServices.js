const ReservaAsiento = require('../database/models/ReservaAsiento');
const Reserva = require('../database/models/Reserva');

const getAsientosReservadosPorProyeccion = async (proyeccionId) => {
  // Obtener las reservas para un determinado proyeccionId
  const reservas = await Reserva.findAll({
    where: { proyeccion_id: proyeccionId },
    attributes: ['id_reserva'], // Solo nos interesa el id de la reserva
  });

  // Si no hay reservas, retornamos un arreglo vacío
  if (reservas.length === 0) {
    return [];
  }

  // Obtenemos los ids de las reservas
  const reservaIds = reservas.map(reserva => reserva.id_reserva);

  // Ahora buscamos los asientos reservados para esas reservas
  const reservaAsientos = await ReservaAsiento.findAll({
    where: {
      reserva_id: reservaIds,
    },
    attributes: ['asiento_id'], // Solo nos interesa el id del asiento
  });

  // Devolvemos un arreglo de los id de los asientos
  return reservaAsientos.map(reservaAsiento => reservaAsiento.asiento_id);
};

module.exports = {
  getAsientosReservadosPorProyeccion
};
