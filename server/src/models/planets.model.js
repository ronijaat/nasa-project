const {parse} = require("csv-parse");
const fs = require("fs");
const path = require("path");

const planets = require("./planets.mongo");



function isHabitablePlannet(planet){
    return planet['koi_disposition'] ==='CONFIRMED'
    && planet["koi_insol"] > 0.36 && planet["koi_insol"] < 1.11 
    && planet["koi_prad"] < 1.6 ;                
}

function loadPlanetsdata(){
    return new Promise((resolve,reject)=>{
    fs.createReadStream(path.join(__dirname,'..','..','data',"kepler_data.csv"))
    .pipe(parse({
        comment:"#",
        columns: true,
    }))
    .on('data',async (data)=>{
        if(isHabitablePlannet(data)){
            //insert + update = upsert
            await savePlanet(data);
        }
    })
    .on('error',(err)=>{
        console.log(err);
        reject(err);
    })
    .on('end',async ()=>{
        const HabitablePlannetLength = (await planets.find({})).length;
        console.log(`${HabitablePlannetLength} HabitablePlannet Found!!!!`);
        //console.log(HabitablePlannet.map((planet)=>{
        //    return planet["kepler_name"]; 
        //}));
        resolve();
    });
    });
}

async function getAllPlannets(){
    return await planets.find({},{
        '_id':0 ,'__v':0
    });
}

async function savePlanet(planet){
    try{
        await planets.updateOne({
            keplerName : planet.kepler_name,
        },{
            keplerName : planet.kepler_name,
        },{
        upsert : true,
        });
    }
    catch(err){
        console.log(`Planets not found ${err}`);
    }
}

    module.exports = {
        loadPlanetsdata,
        getAllPlannets,
    };