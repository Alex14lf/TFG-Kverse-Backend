const ticketService = require('../services/ticketServices');

const getTicketsByUser = async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const tickets = await ticketService.obtenerTicketsPorUsuario(usuarioId);
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error obteniendo tickets:", error);
    res.status(500).json({ message: 'Error al obtener tickets' });
  }
};

module.exports = {
  getTicketsByUser
};
