"use strict";

require("dotenv").config();

const mongoose = require("mongoose");
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
mongoose.connect(`${process.env.MONGODB_URI}`, options);

mongoose.connection.on("connected", () => {
  console.log("mongodb is connected =P");
});
mongoose.connection.on("error", (err) => {
  console.log(`mongodb is NOOOOOOOT connected , ${err}`);
});

require("./src/server.js").start(process.env.PORT);
