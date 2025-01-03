const carteleraService = require('../services/carteleraServices')

const getCartelera = async (req, res) =>{
    const cartelera = await carteleraService.getCartelera()
    res.json(cartelera);
}

module.exports = {
    getCartelera
}
