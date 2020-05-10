require("dotenv").config();
const express = require("express");
const Router = express.Router();
const passport = require("../auth");
const path = require("path");
const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://workday-planner.herokuapp.com/member-access"
);

const url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: "online",

  // If you only need one scope you can pass it as a string
  scope: "https://www.googleapis.com/auth/calendar",
});

const db = require("../models");

Router.post("/create-account", (req, res) => {
  db.User.create(req.body).then((data) => {
    //console.log(data);
    //res.json(data);
    res.redirect(307, "/api/login");
  });
});

Router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json(req.user);
  //res.render("memberIndex");
});

Router.get("/url", (req, res) => {
  res.json(url);
});
module.exports = Router;
