const moviesService = require('../services/moviesServices');

const getMovies = async (req, res) => {
    try {
        const movies = await moviesService.getMovies();
        res.status(200).json(movies); 
    } catch (error) {
        console.error("Error en getMovies:", error.message);
        res.status(500).json({ error: 'Error al obtener las películas' });  
    }
};

const getActiveMovies = async (req, res) => {
    try {
        const movies = await moviesService.getActiveMovies();
        res.status(200).json(movies); 
    } catch (error) {
        console.error("Error en getActiveMovies:", error.message);
        res.status(500).json({ error: 'Error al obtener las películas activas' });  
    }
};

const getMovieById = async (req, res) => {
    try {
        const { id } = req.params;  
        const movie = await moviesService.getMovieById(id);
        res.status(200).json(movie); 
    } catch (error) {
        console.error("Error en getMovieById:", error.message);
        res.status(404).json({ error: 'Película no encontrada' });  
    }
};


module.exports = {
    getMovies,
    getActiveMovies,
    getMovieById,
};
