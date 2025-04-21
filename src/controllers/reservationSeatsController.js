const { getAsientosReservadosPorProyeccion } = require('../services/reservationSeatsServices');

const obtenerAsientosReservados = async (req, res) => {
  const { proyeccionId } = req.params;

  try {
    // Llamamos al servicio para obtener los asientos reservados para la proyección dada
    const asientosReservados = await getAsientosReservadosPorProyeccion(proyeccionId);
    res.status(200).json(asientosReservados); // Retornamos el listado de asientos reservados
  } catch (error) {
    console.error("Error al obtener asientos reservados:", error);
    res.status(500).json({ error: "Error al obtener los asientos reservados" });
  }
};

module.exports = {
  obtenerAsientosReservados
};
