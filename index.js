const bodyParser = require("body-parser");
const express = require("express");
const csvRouter = require("./routes/csv");
const { errorHandler } = require("./middleware/error");

const app = express();
require("dotenv").config();

app.use(bodyParser.json());
app.use(express.static("public"));
app.use("/api/v1/csv", csvRouter);

app.get("/", (_, response) => {
  response.sendFile(__dirname + "/public/index.html");
});

app.use(errorHandler);
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

module.exports = app;
