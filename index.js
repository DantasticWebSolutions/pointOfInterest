const express = require("express");
const session = require("express-session");
const hbs = require("hbs");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");

const localStrategy = require("passport-local").Strategy;
const dbconfig = require("./config/database.config");
const app = express();

// Import routes form routes.js file
require("./app/routes/routes.js")(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect the database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(dbconfig.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    // Show Message if successfull with database name
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);

    process.exit(1);
  }
};
connectDB();

//Middleware --> Before any action the following action will perform
app.set("views", path.join(__dirname, "app/views"));
app.set("view engine", "hbs");

// app.use('/here you put the name of the folder that you JavaScript file is located', express.static(__dirname + 'and here the path to the folder that you JavaScript file is located');
app.use("/js", express.static(__dirname + "/public/js"));
app.use("/css", express.static(__dirname + "/public/css"));

//START THE SERVER
var port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Server started at port 8000");
});
