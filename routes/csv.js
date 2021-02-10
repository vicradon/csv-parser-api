const { Router } = require("express");
const csvController = require("../controllers/csv");
const router = Router();

router.get("/", csvController.getSampleCsv);
router.post("/", csvController.extractCsvFields);

module.exports = router;
