const http = require('http');
require('dotenv').config();

const {connectMongo} = require("../services/mongo");

const app = require('./app');


const { loadPlanetsdata } = require("./models/planets.model");
const {loadLaunchdata} = require("./models/launches.model");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer(){
    await connectMongo();
    await loadPlanetsdata();
    await loadLaunchdata();

    server.listen(PORT,()=>{
        console.log(`Server is Listining on ${PORT}...`);
    });
}

startServer();

