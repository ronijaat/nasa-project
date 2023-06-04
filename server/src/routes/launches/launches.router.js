const express = require("express");

const {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLauch
} = require('./launches.controller');
const { addNewLaunch } = require("../../models/launches.model");

const launchRouter = express.Router();

launchRouter.get('/',httpGetAllLaunches);
launchRouter.post("/",httpAddNewLaunch);
launchRouter.delete("/:id",httpAbortLauch);

module.exports = launchRouter;