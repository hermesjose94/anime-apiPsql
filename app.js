require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");

var authApiRouter = require("./server/routes/api/auth");
var animesApiRouter = require("./server/routes/api/animes");
var usersApiRouter = require("./server/routes/api/users");

const app = express();
const port = process.env.PORT || 4000;

// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

// // enable CORS
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//   })
// );

//MIDDLEWARES GLOBAL
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: false, limit: "2mb" }));

// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//ROUTES
app.use("/api/auth", authApiRouter);
app.use("/api/animes", animesApiRouter);
app.use("/api/users", usersApiRouter);

app.listen(port, () => {
  console.log("Server started on: " + port);
});
