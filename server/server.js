const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
dotenv.config();

connectDB();

const app = express();

app.get("/", (req, res) => {
  res.send("API Running Successfully!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`.yellow.bold)
);
