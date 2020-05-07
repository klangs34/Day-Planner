const express = require("express");
const Router = express.Router();
const passport = require("../auth");
const path = require("path");

const db = require("../models");

Router.post("/create-account", (req, res) => {
  db.User.create(req.body).then((data) => {
    console.log(data);
    res.json(data);
  });
});

Router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json(req.user);
  //res.render("memberIndex");
});

module.exports = Router;
