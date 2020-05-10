require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const logger = require("morgan");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("../auth/index");
const session = require("express-session");
const exphbs = require("express-handlebars");
const isAuthenticated = require("../middleware/isAuthenticated");
const { google } = require("googleapis");

mongoose.connect("mongodb://localhost/dayplanner", {
  useNewUrlParser: true,
});

// mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/dayplanner", {
//   useNewUrlParser: true,
// });

const PORT = process.env.PORT || 8080;

const APIRoutes = require("../routes");

app.use(cors());
app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "planplan", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", APIRoutes);

app.use(express.static(path.join(__dirname, "../public")));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  console.log(req);
  res.sendFile("index.html");
});

app.get("/create-account", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/createAccount.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});

// Route for logging user out
app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

app.get("/member-access", isAuthenticated, async (req, res) => {
  const { code } = req.query;

  if (code) {
    const oauth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      "http://localhost:8080/member-access"
    );
    // This will provide an object with the access_token and refresh_token.
    // Save these somewhere safe so they can be used at a later time.
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    console.log(tokens);
  }
  res.render("memberIndex");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error("Not Found");
  error.status = 404;
  next(err);
  //next(createError(404));
});

// error handler middleware
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error message
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Oops!  Something went wrong!",
    },
  });
});

app.listen(PORT, () => console.log("Server listening on port: " + PORT));
