//POSIBLE SOLUCION

const axios = require('axios');
const { Pelicula } = require('./models');  // Asumimos que tienes un modelo Pelicula

async function actualizarPeliculas() {
    try {
        // Paso 1: Obtener el listado de películas de la API
        const response = await axios.get('URL_DE_TU_API'); // Cambia esto por la URL real de la API
        const peliculasAPI = response.data; // Suponemos que la API devuelve un array de películas

        // Paso 2: Obtener los IDs de las películas ya almacenadas en la base de datos
        const peliculasExistentes = await Pelicula.findAll({
            attributes: ['id_api'],  // Suponemos que 'id_api' es el campo único para la película
        });

        // Convertir a un array de IDs
        const idsExistentes = peliculasExistentes.map(pelicula => pelicula.id_api);

        // Paso 3: Iterar sobre el listado de películas obtenidas de la API
        const peliculasAPIConOrden = peliculasAPI.map((pelicula, index) => ({
            ...pelicula,
            orden: index + 1  // Asignamos el campo 'orden' del 1 al 15 (según el índice)
        }));

        // Paso 4: Insertar las nuevas películas y actualizar las existentes
        for (let i = 0; i < peliculasAPIConOrden.length; i++) {
            const pelicula = peliculasAPIConOrden[i];

            if (!idsExistentes.includes(pelicula.id)) {
                // Si la película no existe en la base de datos, la insertamos
                await Pelicula.create({
                    id_api: pelicula.id,  // Suponiendo que 'id' es el campo único
                    titulo: pelicula.titulo,
                    // Otros campos de la película...
                    orden: pelicula.orden,
                });
            } else {
                // Si la película ya existe, actualizamos solo el campo 'orden'
                await Pelicula.update(
                    { orden: pelicula.orden },
                    { where: { id_api: pelicula.id } }
                );
            }
        }

        console.log('Películas actualizadas correctamente.');
        
    } catch (error) {
        console.error('Error al actualizar las películas:', error);
    }
}
