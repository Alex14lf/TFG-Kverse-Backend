const Pelicula = require('../database/models/Pelicula');
const Sala = require('../database/models/Sala');
const Usuario = require('../database/models/Usuario');
const Proyeccion = require('../database/models/Proyeccion');
const { Op } = require('sequelize');
const cron = require('node-cron'); // Para automatizar las tareas

// Función principal que integra todo
const updateCartelera = async () => {
  await createUser(); // Crear usuario admin si no existe
  await createRooms(); // Crear salas de cine si no existen

  const movies = await getApiMovies();
  const moviesWithGenres = [];

  for (let movie of movies) {
    let order = movies.indexOf(movie) + 1; // Orden basado en la posición de la película
    const movieData = await getMovieDetais(movie.id);
    const formatedMovie= await updateMovie(movieData, order);
    moviesWithGenres.push(formatedMovie);
  }

  // Desactivar las películas que ya no están en cartelera
  await deactivateMovies(moviesWithGenres);

  // Generar las proyecciones desde hoy hasta el domingo
  await generateProjections(moviesWithGenres);
  
  console.log("🎬 Cartelera actualizada correctamente");
  return moviesWithGenres;
};

// // Ejecutar la actualización de la cartelera cada cierto tiempo (2 minutos en este caso)
// cron.schedule('*/2 * * * *', async () => {
//   console.log("🚀 Iniciando actualización de la cartelera...");
//   await updateCartelera();
//   console.log("🚀 Actualización de la cartelera finalizada.");
// });

// Exportar la función para poder ejecutarla manualmente si es necesario
module.exports = {
  updateCartelera,
};

/////////////////////////////////FUNCIONES///////////////////////////////////////

// 1. Obtener las películas desde la API
const getApiMovies = async () => {
  const cartelera = process.env.URL_MOVIES;
  const apiKey = process.env.TMDB_API_KEY;
  const params = process.env.PARAMS;
  const urlMovies = `${cartelera}${params}${apiKey}`;
  const response = await fetch(urlMovies);
  // const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1&api_key=${process.env.TMDB_API_KEY}`);
  const data = await response.json();
  return data.results.slice(0, 10); // Limitar a 10 películas
};

// 2. Obtener detalles de cada película
const getMovieDetais = async (movieId) => {
  const MovieDetail = process.env.URL_MOVIEDETAIL;
  const apiKey = process.env.TMDB_API_KEY;
  const params = process.env.PARAMS;
  const urlMovieDetail = `${MovieDetail}${movieId}${params}${apiKey}`;
  const response = await fetch(urlMovieDetail);
  const movieData = await response.json();
  return movieData;
};

// 3. Crear o actualizar las películas en la base de datos
const updateMovie = async (movieData, order) => {
  const defaultCartel = '/2iRitrob4aNt4Rc8E40KYQ82DSh.jpg';
  const defaultPoster = '/2P14LNK2zDBf84tF016blkz4Q4C.jpg';
  const urlImagenes = process.env.URL_IMAGENES;

  const movieObject = {
    id_api: movieData.id,
    titulo: movieData.title || "Matrix",
    genero: movieData.genres[0]?.name || "Ciencia ficción",
    sinopsis: movieData.overview?.length >= 10 ? movieData.overview : "Sinopsis no disponible",
    duracion: movieData.runtime > 0 ? movieData.runtime : 90,
    poster: `${urlImagenes}${movieData.poster_path || defaultPoster}`,
    cartel: `${urlImagenes}${movieData.backdrop_path || defaultCartel}`,
    fecha_estreno: movieData.release_date || "1970-01-01",
    valoracion: movieData.vote_average > 0 ? parseFloat(movieData.vote_average.toFixed(1)) : 5,
    disponible: true,
    orden: order
  };


  // Comprobar si la película ya existe en la BD
  const peliculaExistente = await Pelicula.findOne({ where: { id_api: movieObject.id_api } });
  
  if (peliculaExistente) {
    // Si ya existe, actualizar el orden
    await Pelicula.update({ orden: order, disponible: true }, { where: { id_api: movieObject.id_api } });
    console.log(`✅ Actualizado orden de película: ${movieObject.titulo}`);
  } else {
    // Si no existe, crearla
    await Pelicula.create(movieObject);
    console.log(`🆕 Película añadida: ${movieObject.titulo}`);
  }

  return movieObject;
};

// 4. Desactivar las películas que ya no están en cartelera
const deactivateMovies = async (moviesWithGenres) => {
  const idsEnCartelera = moviesWithGenres.map(m => m.id_api);
  await Pelicula.update(
    { disponible: false, orden: null },
    { where: { id_api: { [Op.notIn]: idsEnCartelera } } }
  );
  console.log("🎬 Películas desactivadas correctamente.");
};

// 5. Obtener las salas de cine
const createRooms = async () => {
  const rooms = [
    { nombre: "Sala 1", capacidad: 100 },
    { nombre: "Sala 2", capacidad: 100 },
    { nombre: "Sala 3", capacidad: 100 },
    { nombre: "Sala 4", capacidad: 100 },
    { nombre: "Sala 5", capacidad: 100 }
  ];

  try {
    // Comprobar si ya existen salas en la base de datos
    const existingRooms = await Sala.findAll();

    if (existingRooms.length === 0) {
      // Si no existen, crear las salas
      for (let room of rooms) {
        await Sala.create(room);
        console.log(`🆕 Sala creada: ${room.nombre}`);
      }
    } else {
      console.log("‼️ Las salas ya existen en la base de datos.");
    }
  } catch (error) {
    console.error("❌ Error al crear las salas:", error);
  }
};

// 6. Crear las proyecciones
const generateProjections = async (moviesWithGenres) => {
  // Obtener las salas de la base de datos
  const salas = await Sala.findAll();

  if (salas.length === 0) {
    console.log("⚠️ No se han encontrado salas en la base de datos.");
    return;
  }

  // Los horarios fijos de las proyecciones: [16:00, 18:00, 20:00, 22:00]
  const horarios = [16, 18, 20, 22];

  // Obtener la fecha actual y la fecha del próximo domingo
  const fechaActual = new Date();
  const diaDeLaSemana = fechaActual.getDay();
  const diferenciaHastaDomingo = 7 - diaDeLaSemana; // Diferencia hasta el domingo
  const domingoFecha = new Date(fechaActual);
  domingoFecha.setDate(fechaActual.getDate() + diferenciaHastaDomingo); // Fecha del próximo domingo

  let peliculaIndex = 0;

  // Crear las proyecciones para cada día hasta el domingo
  // Iniciar el bucle desde la fecha actual hasta el próximo domingo
  for (let dia = new Date(fechaActual); dia <= domingoFecha; dia.setDate(dia.getDate() + 1)) {
    let fecha = new Date(dia);  // Copiar la fecha base para cada día

    // Para cada sala, asignamos 2 películas con 4 horarios
    for (let sala of salas) {
      // Dos películas por sala
      for (let j = 0; j < 2; j++) {
        const pelicula = moviesWithGenres[peliculaIndex % moviesWithGenres.length]; // Usamos el índice cíclico para las películas
        let horariosAsignados = [];

        // Asignar horarios específicos a cada película
        if (j === 0) { // Película 1, horarios 16:00 y 20:00
          horariosAsignados = [horarios[0], horarios[2]]; // Usando 16:00 y 20:00 de `horarios`
        } else { // Película 2, horarios 18:00 y 22:00
          horariosAsignados = [horarios[1], horarios[3]]; // Usando 18:00 y 22:00 de `horarios`
        }

        // Crear las proyecciones con los horarios asignados
        for (let k = 0; k < horariosAsignados.length; k++) {
          const horaInicio = horariosAsignados[k];
          
          // Crear una nueva fecha con la hora deseada para cada proyección
          let fechaInicio = new Date(fecha); // Copiar la fecha base para evitar modificarla
          fechaInicio.setHours(horaInicio, 0, 0, 0); // Establecer la hora correcta

          // Verificar si ya existe una proyección para esa sala, película y hora
          const proyeccionExistente = await Proyeccion.findOne({
            where: {
              pelicula_id: pelicula.id_api, // Usamos el id de la API para las proyecciones
              sala_id: sala.id_sala,
              fecha_inicio: fechaInicio
            }
          });

          if (!proyeccionExistente) {
            // Si no existe, creamos la proyección
            await Proyeccion.create({
              pelicula_id: pelicula.id_api,  // id de la película obtenida de la API
              sala_id: sala.id_sala,
              fecha_inicio: fechaInicio,
              duracion: pelicula.duracion
            });

            console.log(`🎬 Proyección añadida para "${pelicula.titulo}" en la Sala "${sala.nombre}" a las ${fechaInicio}`);
          } else {
            console.log(`⚠️ Ya existe una proyección para "${pelicula.titulo}" en la Sala "${sala.nombre}" a las ${fechaInicio}`);
          }
        }

        // Incrementar el índice de la película para la siguiente
        peliculaIndex++;
      }
    }
  }

  console.log("✅ Proyecciones generadas correctamente.");
};



// 7. Crear el usuario admini
const createUser = async () => {
  try {
      // Verifica si ya existen usuarios
      const existingUsers = await Usuario.findAll();

      // Si no hay usuarios, crea uno nuevo
      if (existingUsers.length === 0) {
          const newUser = await Usuario.create({
              dni: '07601563L',
              nombre: 'Admin',
              apellidos: 'Admin Admin',
              email: 'admin@gmail.com',
              fecha_nacimiento: '1990-05-20',
              telefono: '691014302',
              password: 'Kverse123'  // La contraseña se hasheará automáticamente
          });

          console.log('✅ Usuario creado con éxito:', newUser.get({ plain: true }));
      } else {
          console.log("⚠️ Ya existen usuarios en la base de datos.");
      }
  } catch (error) {
      console.error('❌ Error al crear el usuario:', error.message);
  }
};
