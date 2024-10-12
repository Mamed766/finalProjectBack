require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db/db");
const path = require("path");
const router = express.Router();

//database connection
connection();

//middlewares
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));
