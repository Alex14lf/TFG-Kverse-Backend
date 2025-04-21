const { createReservaWithAsientos, deleteReservaById } = require("../services/reservationServices");

const crearReserva = async (req, res) => {
  const { usuario_id, proyeccion_id, asientos } = req.body;

  if (!usuario_id || !proyeccion_id || !Array.isArray(asientos) || asientos.length === 0) {
    return res.status(400).json({ error: "Datos inválidos o incompletos" });
  }

  try {
    const reserva = await createReservaWithAsientos({ usuario_id, proyeccion_id, asientos });
    res.status(201).json({ message: "Reserva creada con éxito", reserva });
  } catch (error) {
    console.error("Error al crear reserva:", error);
    res.status(500).json({ error: "Error al crear la reserva" });
  }
};

const deleteReserva = async (req, res) => {
  const { idReserva } = req.params;

  try {
    await deleteReservaById(idReserva);
    res.status(200).json({ message: 'Reserva anulada con éxito' });
  } catch (error) {
    console.error('Error al anular la reserva:', error);
    res.status(500).json({ error: 'Hubo un problema al anular la reserva' });
  }
};

module.exports = {
  crearReserva,
  deleteReserva
};
