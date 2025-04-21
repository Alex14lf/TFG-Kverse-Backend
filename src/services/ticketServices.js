const Reserva = require('../database/models/Reserva');
const Proyeccion = require('../database/models/Proyeccion');
const Pelicula = require('../database/models/Pelicula');
const Sala = require('../database/models/Sala');
const ReservaAsiento = require('../database/models/ReservaAsiento');
const Asiento = require('../database/models/Asiento');

const obtenerTicketsPorUsuario = async (usuarioId) => {
    // Primero obtenemos todas las reservas de un usuario
    const reservas = await Reserva.findAll({
      where: { usuario_id: usuarioId },
    });
  
    const result = [];
  
    // Iteramos sobre cada reserva
    for (const reserva of reservas) {
      // Obtenemos los asientos de la reserva usando su ID
      const reservaAsientos = await ReservaAsiento.findAll({
        where: { reserva_id: reserva.id_reserva },
        include: [
          {
            model: Asiento, // Incluimos el modelo Asiento para obtener los detalles de los asientos
          }
        ]
      });
  
      // Obtenemos la proyección usando el proyeccion_id de la reserva
      const proyeccion = await Proyeccion.findOne({
        where: { id_proyeccion: reserva.proyeccion_id },
        include: [
          {
            model: Pelicula, // Incluimos la película asociada a la proyección
          }
        ]
      });
  
      // Si hay proyección y película, obtenemos el título
      const peliculaTitulo = proyeccion && proyeccion.pelicula ? proyeccion.pelicula.titulo : 'Película no encontrada';
  
      // Creamos el objeto con los datos de la reserva, los asientos y la película
      const reservaData = {
        id_reserva: reserva.id_reserva,
        fecha_reserva: reserva.fecha_reserva,
        pelicula: peliculaTitulo,  // El título de la película
        fecha_proyeccion: proyeccion ? proyeccion.fecha_inicio : 'Fecha no disponible',  
        sala: proyeccion ? `Sala ${proyeccion.sala_id}` : 'Sala no encontrada', 
        asientos: reservaAsientos.map(r => ({
          fila: r.asiento.fila,
          numero: r.asiento.numero
        }))
      };
  
      // Añadimos la reserva al resultado final
      result.push(reservaData);
    }
  
    return result;
  };


module.exports = {
    obtenerTicketsPorUsuario
};
