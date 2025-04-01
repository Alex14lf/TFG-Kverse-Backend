const Pelicula = require('../database/models/Pelicula');

const getMovies = async () => {
    try {
        const movies = await Pelicula.findAll({
            order: [['orden', 'ASC']]
        });
        return movies; 
    } catch (error) {
        console.error("Error en el servicio de películas:", error.message);
        throw new Error('Error al obtener las películas');
    }
};

const getActiveMovies = async () => {
    try {
        const movies = await Pelicula.findAll({
            where: { disponible: true }, 
            order: [['orden', 'ASC']]
        });
        return movies;
    } catch (error) {
        console.error("Error al obtener las películas activas:", error.message);
        throw new Error('Error al obtener las películas activas');
    }
};


const getMovieById = async (id) => {
    try {
        const movie = await Pelicula.findByPk(id); 
        if (!movie) {
            throw new Error('Película no encontrada'); 
        }
        return movie;  
    } catch (error) {
        console.error(`Error al obtener la película con ID ${id}:`, error.message);
        throw new Error('Error al obtener la película');
    }
};

const getMovieByIdApi = async (id_api) => {
    try {
        const movie = await Pelicula.findOne({ where: { id_api } });  // Buscar por el ID externo

        if (!movie) {
            throw new Error('Película no encontrada');
        }

        return movie;
    } catch (error) {
        console.error(`Error al obtener la película con externalId ${id_api}:`, error.message);
        throw new Error('Error al obtener la película');
    }
};

module.exports = {
    getMovies,
    getActiveMovies,
    getMovieById,
    getMovieByIdApi
};
