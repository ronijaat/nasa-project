const express = require("express");

const {
    httpGetAllPanets,
} = require('./planet.controller');

const planetRouter = express.Router();


planetRouter.get("/", httpGetAllPanets);

module.exports = planetRouter;