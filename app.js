const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const routes = require("./controller");
require("dotenv").config();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));
app.use(cors());
app.use(routes);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
