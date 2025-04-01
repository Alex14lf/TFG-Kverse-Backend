const updateMoviesService = require('../services/updateMoviesServices')

const getCarteleraAPI = async (req, res) =>{
    const cartelera = await updateMoviesService.updateCartelera()
    res.json(cartelera);
}

module.exports = {
    getCarteleraAPI
}
