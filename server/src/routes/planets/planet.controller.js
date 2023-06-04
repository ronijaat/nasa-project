const { getAllPlannets } = require('../../models/planets.model');

async function httpGetAllPanets(req,res){
    console.log(await getAllPlannets());
    return res.status(200).json(await getAllPlannets());
}

module.exports = {
    httpGetAllPanets,
};