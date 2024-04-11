require("dotenv").config();
const express = require("express");
const createError = require("http-errors");
const morgan = require("morgan");

//#region Database connetion
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const connStr = "mongodb://127.0.0.1:27017/daillySIMsalesinfo";
// Connecting to the database
mongoose
  .connect(connStr, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now... \n", err);
    process.exit();
  });
//#endregion

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.get("/", async (req, res, next) => {
  res.send({ message: "Awesome it works 🐻" });
});

app.use("/api", require("./routes/api.route"));

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
