const Joi = require("joi");
const { promisify } = require("util");
const fs = require("fs");
const readFileAsync = promisify(fs.readFile);
const axios = require("axios");
const detectCSV = require("detect-csv");
const { v4: uuid } = require("uuid");
const neatCsv = require("neat-csv");

class CsvController {
  getSampleCsv = async (_, response) => {
    response.contentType = "text/csv";
    const csvData = await readFileAsync("employees.csv", { encoding: "utf8" });
    response.send(csvData);
  };
  extractCsvFields = async (request, response, next) => {
    const requestBodySchema = Joi.object({
      url: Joi.string()
        .uri({
          scheme: ["http", "https"],
        })
        .required(),
      select_fields: Joi.array(),
    });
    response.contentType = "application/json";

    try {
      const { url, select_fields } = await requestBodySchema.validateAsync({
        url: request.body.url,
        select_fields: request.body.select_fields,
      });

      const { data: csvData } = await axios.get(url);
      const csvMetaData = detectCSV(csvData);
      if (!csvMetaData) {
        throw new ValidationError("CSV is invalid");
      }
      const { delimiter } = csvMetaData;

      const jsonifiedCsv = await neatCsv(csvData, { separator: delimiter });
      const results = this.filterJson(jsonifiedCsv, select_fields);
      return response.json({
        conversion_key: uuid(),
        json: results,
      });
    } catch (error) {
      next(error);
    }
  };
  filterJson = (data, select_fields) => {
    const allFields = Object.keys(data[0]);
    let validFields = [];

    if (!select_fields || select_fields.length === 0) {
      validFields = allFields;
    } else {
      for (let field of select_fields) {
        if (allFields.includes(field)) {
          validFields.push(field);
        }
      }
    }

    return data.map((row) => {
      const validItems = {};
      for (let field in row) {
        if (validFields.includes(field)) {
          validItems[field] = row[field];
        }
      }
      return validItems;
    });
  };
}

module.exports = new CsvController();
