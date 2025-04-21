const { Op } = require("sequelize");
const Proyeccion = require("../database/models/Proyeccion");

const getFutureShowtimesById = async (peliculaId) => {
  const ahora = new Date();

  const proyecciones = await Proyeccion.findAll({
    where: {
      pelicula_id: peliculaId,
      fecha_inicio: {
        [Op.gte]: ahora
      }
    },
    order: [['fecha_inicio', 'ASC']]
  });

  return proyecciones.map(p => {
    // Convertir la fecha UTC a la zona horaria de Madrid (UTC+2)
    const fechaUTC = new Date(p.fecha_inicio);
    const fechaMadrid = new Date(fechaUTC.getTime() + 2 * 60 * 60 * 1000); // Sumamos 2 horas

    return {
      id: p.id_proyeccion,
      date: fechaMadrid.toISOString().split('T')[0], // Formato yyyy-mm-dd
      time: fechaMadrid.toISOString().split('T')[1].slice(0, 5), // Formato hh:mm
      sala_id: p.sala_id,
      duracion: p.duracion
    };
  });
};

module.exports = {
  getFutureShowtimesById
};
