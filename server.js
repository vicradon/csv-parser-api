const { v4: uuid } = require("uuid");
const neatCsv = require('neat-csv');
const bodyParser = require("body-parser");
const express = require("express");
const axios = require("axios");
const detectCSV = require('detect-csv')
const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/", async (request, response) => {
  response.contentType = "application/json"
  if (Object.keys(request.body).length === 0) {
    return response.status(400).send({ message: "CSV object is required" })
  }
  const {
    csv: { url, select_fields }
  } = request.body;
  if (Object.keys(request.body).length === 0) {
    return response.status(400).send({ message: "CSV object is required" })
  }
  if (!url) {
    return response.status(400).send({ message: "url is required" })
  }

  try {
    const { data: csvData } = await axios.get(url);
    const csvMetaData = detectCSV(csvData)
    if (!csvMetaData){
      return response.status(400).send({ message: "csv is not valid" })
    }
    const {delimiter} = csvMetaData

    const rawResults = await neatCsv(csvData, {separator: delimiter})
    const allFields = Object.keys(rawResults[0])
    let validFields = []

    if (!select_fields || select_fields.length === 0) {
      validFields = allFields
    } else {
      for (let field of select_fields) {
        if (allFields.includes(field)) {
          validFields.push(field)
        }
      }
    }

    const results = rawResults.map((row) => {
      const validItems = {}
      for (let field in row) {
        if (validFields.includes(field)) {
          validItems[field] = row[field]
        }
      }
      return validItems
    })

    return response.json({
      "conversion_key": uuid(),
      json: results
    });
  } catch (error) {
    if (error.errno === 'EPROTO') {
      return response.status(400).json({
        message: "Invalid URL"
      })
    }
    
    const { status, statusText } = error.response
    return response.status(status).json({
      message: statusText
    })
  }
});

app.get('/', (request, response) => {
  response.sendFile(__dirname + "/public/index.html");
})

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

module.exports = app