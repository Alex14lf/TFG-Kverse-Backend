const Usuario = require("./models/Usuario");
const Asiento = require("./models/Asiento");
const Sala = require("./models/Sala");
const Pelicula = require("./models/Pelicula");
const Proyeccion = require("./models/Proyeccion");
const Reserva = require("./models/Reserva");
const ReservaAsiento = require("./models/ReservaAsiento");

//COMPROBAR ESTO
Sala.hasMany(Asiento, { foreignKey: 'sala_id' });
Asiento.belongsTo(Sala, { foreignKey: 'sala_id' });

Pelicula.hasMany(Proyeccion, { foreignKey: 'pelicula_id' });
Proyeccion.belongsTo(Pelicula, { foreignKey: 'pelicula_id' });

Sala.hasMany(Proyeccion, { foreignKey: 'sala_id' });
Proyeccion.belongsTo(Sala, { foreignKey: 'sala_id' });

Proyeccion.hasMany(Reserva, { foreignKey: 'proyeccion_id' });
Reserva.belongsTo(Proyeccion, { foreignKey: 'proyeccion_id' });

Usuario.hasMany(Reserva, { foreignKey: 'usuario_id' });
Reserva.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Reserva.belongsToMany(Asiento, { through: ReservaAsiento, foreignKey: 'reserva_id' });
Asiento.belongsToMany(Reserva, { through: ReservaAsiento, foreignKey: 'asiento_id' });
