const bcrypt = require('bcryptjs');

const userHooks = {
  async beforeCreate(user) {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  },
  
  async beforeUpdate(user) {
    if (user.changed('password')) {  // Solo se hashea si la contraseña cambió
      user.password = await bcrypt.hash(user.password, 10);
    }
  }
};

module.exports = userHooks;