const axois = require('axios');

const launches = require("./launches.mongo");
const planets = require('./planets.mongo');


const DEFAULT_FLIGHT_NUMBER = 100;


// const launch = {
//     flightNumber : 100,
//     mission : 'Kepler Exploriation X',
//     rocket : 'Explorer 1S1',
//     launchDate : new Date('December 27, 2030'),
//     target : 'Kepler-442 b',
//     customers : ['NASA','ZTM'],
//     upcoming : true,
//     success : true,
// }

// savelaunch(launch)

//launches.set(launch.flightNumber, launch);

const SPACE_X_API = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches(){
    console.log('Downloading launch data');
    const response = await axois.post(SPACE_X_API,{
        query: {},
        options:{
            pagination:false,
            populate:[
                {
                    path:"rocket",
                    select:{
                        name:1
                }
            },
            {
                path:"payloads",
                select:{
                    customers:1
                }
            }
        ]
        }
    });

    if(response.status != 200){
        console.log('Problem in downloadinfg launch data!!!');
        throw new Error('Launch data download failed');
    }

    const launchDocs = response.data.docs; //axois puts response from api in data so to fetch we haveto do response.data

    for(const launchdoc of launchDocs){
        const payloads = launchdoc['payloads'];
        const customers = payloads.flatMap((payload)=>{
            return payload['customers'];
        })

        const launch = {
            flightNumber : launchdoc['flight_number'],
            mission : launchdoc['name'],
            rocket : launchdoc['rocket']['name'],
            launchDate : launchdoc['date_local'],
            customers : customers,
            upcoming : launchdoc['upcoming'],
            success : launchdoc['success'],
        };
        console.log(`${launch.flightNumber} ${launch.mission}`);

        await savelaunch(launch);
    }
}

async function loadLaunchdata() {
    const firstlaunch = await findlaunch({
        flightNumber : 1,
        rocket : 'Falcon 1',
        mission : 'FalconSat',
    });
    if(firstlaunch){
        console.log('Launch data already loaded!');
    }
    else{
        await populateLaunches();
    }
}

async function findlaunch(filter){
    return await launches.findOne(filter);
}

async function existsLaunchwithId(launchID){
    return await findlaunch({
        flightNumber:launchID,
    })
}

async function getLatestFlightNumber(){
    const LatestFlight = await launches
        .findOne()
        .sort('-flightNumber')  //sorting in descending by adding -

    if(!LatestFlight){
        return DEFAULT_FLIGHT_NUMBER;
    }

    return LatestFlight.flightNumber;
}

async function getAllLaunches(skip,limit){
    return await launches.find({},{
        '_id':0, '__v':0,
    })
    .sort({ flightNumber:1 })
    .skip(skip)
    .limit(limit)
}

async function savelaunch(launch){
    await launches.findOneAndUpdate({
        flightNumber:launch.flightNumber,
    },launch,{
        upsert : true,
    })
}

async function addNewLaunch(launch){
    const planet = await planets.findOne({
        keplerName:launch.target,
    });

    if(!planet){
        throw new Error("Planet not found!!!");
    }
    latestFlightNumber = await getLatestFlightNumber() + 1;

    const newLaunch = Object.assign(launch,{
        flightNumber: latestFlightNumber,
        customers:['Roni','Nasa'],
        upcoming:true,
        success : true,     
    });

    await savelaunch(newLaunch);
}

async function abortLaunchById(launchId){
    const aborted = await launches.updateOne({
        flightNumber:launchId,
    },{
        upcoming:false,
        sucess:false,
    });

    return aborted.modifiedCount === 1;
}

module.exports={
    loadLaunchdata,
    addNewLaunch,
    getAllLaunches,
    existsLaunchwithId,
    abortLaunchById
};