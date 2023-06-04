const mongoose = require("mongoose");

require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once('open',()=>{
    console.log('MongoDB connection ready');
});

mongoose.connection.on("error",(err)=>{
    console.log(err);
});

async function disConnect(){
    await mongoose.disconnect(MONGO_URL);
}

async function connectMongo(){
    await mongoose.connect(MONGO_URL);
}

module.exports = {
    connectMongo,
    disConnect,
}