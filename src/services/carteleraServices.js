const getCartelera = async () => {
  const apiKey = process.env.TMDB_API_KEY; 
  const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=es-ES`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results; 
};

module.exports = {
  getCartelera,
};
