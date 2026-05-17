const express = require("express");
const router = express.Router();

const uraController = require("../controllers/uraController");

router.post("/opcao", uraController.receberOpcao);

module.exports = router;