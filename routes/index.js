const express = require('express');
const Router = express.Router();

const db = require("../models");

Router.post('/create-account', (req, res) => {
    db.User.create(req.body).then(data => {
        console.log(data);
        res.json(data);
    })
});

module.exports = Router;