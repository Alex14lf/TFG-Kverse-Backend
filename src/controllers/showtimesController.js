const showtimesService= require('../services/showtimesServices');

const getFutureShowtimesById = async (req, res) => {
  const { movieId } = req.params;

  try {
    const proyecciones = await showtimesService.getFutureShowtimesById(movieId);
    res.json(proyecciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las proyecciones" });
  }
};

module.exports = {
  getFutureShowtimesById
};
