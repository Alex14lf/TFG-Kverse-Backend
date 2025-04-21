const Reserva = require('../database/models/Reserva');
const ReservaAsiento = require('../database/models/ReservaAsiento');
const sequelize = require('../database/db');

const createReservaWithAsientos = async ({ usuario_id, proyeccion_id, asientos }) => {
    const transaction = await sequelize.transaction();

    try {
        // 1. Verificar si los asientos ya están reservados en esta proyección
        const ocupados = await ReservaAsiento.findAll({
            where: {
                asiento_id: asientos.map(a => a.id)  // Obtener los IDs de los asientos
            },
            include: [{
                model: Reserva,
                where: { proyeccion_id },
                attributes: ['id_reserva'],  // Traer solo el ID de la reserva
            }],
            transaction  // Pasar la transacción para que la consulta sea parte de la transacción
        });

        // Si se encuentran asientos ocupados, lanzar error
        if (ocupados.length > 0) {
            throw new Error('Uno o más asientos ya están ocupados para esta proyección');
        }

        // 2. Crear la reserva
        const nuevaReserva = await Reserva.create(
            {
                usuario_id,
                proyeccion_id
            },
            { transaction }
        );

        // 3. Crear las entradas en reserva_asientos
        const asientosData = asientos.map((asiento) => ({
            reserva_id: nuevaReserva.id_reserva,
            asiento_id: asiento.id
        }));

        // 4. Insertar los asientos en la tabla `reserva_asientos`
        await ReservaAsiento.bulkCreate(asientosData, { transaction });

        // 5. Confirmar la transacción
        await transaction.commit();
        return nuevaReserva;
    } catch (error) {
        // En caso de error, hacer rollback de la transacción
        await transaction.rollback();
        throw error;
    }
};

const deleteReservaById = async (idReserva) => {
    const reserva = await Reserva.findByPk(idReserva);
    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }
  
    await reserva.destroy(); // Esto eliminará también los asientos si está en cascada
  };


module.exports = {
    createReservaWithAsientos,
    deleteReservaById
};
