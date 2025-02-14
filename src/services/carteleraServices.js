const getCartelera = async () => {
  const cartelera = process.env.URL_MOVIES;
  const MovieDetail = process.env.URL_MOVIEDETAIL
  const params = process.env.PARAMS;
  const apiKey = process.env.TMDB_API_KEY;
  const urlImagenes = process.env.URL_IMAGENES;

  const urlMovies = `${cartelera}${params}${apiKey}`;

  const response = await fetch(urlMovies);
  const data = await response.json();
  const movies = data.results;

  //ARRAY PARA ALMACENAR LAS PELICLAS CON LOS GENEROS
  const moviesWithGenres = [];

  for (let movie of movies) {
    let order = movies.indexOf(movie) + 1;
    let movieId = movie.id;
    let urlMovieDetail = `${MovieDetail}${movieId}${params}${apiKey}`;
    const movieResponse = await fetch(urlMovieDetail);
    const movieData = await movieResponse.json();

    moviesWithGenres.push({
      id_api: movieData.id,
      titulo: movieData.title,
      genero: movieData.genres[0].name,
      sinopsis: movieData.overview,
      duracion: movieData.runtime,
      poster: `${urlImagenes}${movieData.poster_path}`,
      cartel: `${urlImagenes}${movieData.backdrop_path}`,
      fecha_estreno: movieData.release_date,
      valoracion: movieData.vote_average,
      disponible: true,
      orden: order
    });

  };

  return moviesWithGenres;

};

module.exports = {
  getCartelera,
};
