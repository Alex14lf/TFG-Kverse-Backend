const Pelicula = require('../database/models/Pelicula');
const { Op } = require('sequelize');
const cron = require('node-cron'); // Automatizar la cartelera con Node-Cron

const updateCartelera = async () => {
  const cartelera = process.env.URL_MOVIES;
  const MovieDetail = process.env.URL_MOVIEDETAIL;
  const params = process.env.PARAMS;
  const apiKey = process.env.TMDB_API_KEY;
  const urlImagenes = process.env.URL_IMAGENES;

  const urlMovies = `${cartelera}${params}${apiKey}`;
  const response = await fetch(urlMovies);
  //Para hacer pruebas con la actualización de la cartelera
  // const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1&api_key=${process.env.TMDB_API_KEY}&limit=10`);
  const data = await response.json();
  const movies = data.results.slice(0, 10); // Limitar a 10 películas para pruebas
  // console.log(movies)

  const defaultCartel = '/2iRitrob4aNt4Rc8E40KYQ82DSh.jpg';
  const defaultPoster = '/2P14LNK2zDBf84tF016blkz4Q4C.jpg';
  const moviesWithGenres = [];

  // Obtener todas las películas actualmente en la BD
  const peliculasBD = await Pelicula.findAll();
  const peliculasBDMap = new Map(peliculasBD.map(p => [p.id_api, p]));

  for (let movie of movies) {
    let order = movies.indexOf(movie) + 1;
    let movieId = movie.id;
    let urlMovieDetail = `${MovieDetail}${movieId}${params}${apiKey}`;
    const movieResponse = await fetch(urlMovieDetail);
    const movieData = await movieResponse.json();

    const movieObject = {
      id_api: movieData.id,
      titulo: movieData.title || "Matrix",
      genero: movieData.genres[0]?.name || "Ciencia ficción",
      sinopsis: movieData.overview?.length >= 10 ? movieData.overview : "En un futuro donde la inteligencia artificial ha alcanzado un nivel de conciencia peligroso, un grupo de científicos descubre un algoritmo capaz de predecir el futuro. Cuando comienzan a recibir visiones de un desastre inminente que amenaza a la humanidad, se enfrentan a una difícil decisión: ¿pueden cambiar el destino sin desatar consecuencias aún peores?",
      duracion: movieData.runtime > 0 ? movieData.runtime : 90, 
      poster: `${urlImagenes}${movieData.poster_path || defaultPoster}`,
      cartel: `${urlImagenes}${movieData.backdrop_path || defaultCartel}`,
      fecha_estreno: movieData.release_date || "1970-01-01",
      valoracion: movieData.vote_average > 0 ? parseFloat(movieData.vote_average.toFixed(1)) : 5,
      disponible: true,
      orden: order
    };

    moviesWithGenres.push(movieObject);

    // Comprobar si la película ya existe en la BD
    const peliculaExistente = peliculasBDMap.get(movieObject.id_api);

    if (peliculaExistente) {
      // Si ya existe, actualizar el orden
      await Pelicula.update({ orden: order, disponible: true }, { where: { id_api: movieObject.id_api } });
      console.log(`✅ Actualizado orden de película: ${movieObject.titulo}`);
    } else {
      // Si no existe, crearla
      await Pelicula.create(movieObject);
      console.log(`🆕 Película añadida: ${movieObject.titulo}`);
    }
  }

  // Desactivar las películas que ya no están en la cartelera
  const idsEnCartelera = moviesWithGenres.map(m => m.id_api);
  await Pelicula.update(
    { disponible: false , orden: null },
    { where: { id_api: { [Op.notIn]: idsEnCartelera } } }
  );

  console.log("🎬 Cartelera actualizada correctamente");
  return moviesWithGenres;
};

// Actualizar la cartelera cada x tiempo
// cron.schedule('*/2 * * * *', updateCartelera); 

module.exports = {
  updateCartelera,
};
