const express = require("express");
const router = express.Router();
const empruntsController = require("../controllers/emprunts.controller");

router.get("/", empruntsController.getAllEmprunts);
router.get("/en-cours", empruntsController.getEmpruntsEnCours);
router.get("/en-retard", empruntsController.getEmpruntsEnRetard);
router.post("/", empruntsController.createEmprunt);
router.put("/:id/retour", empruntsController.retournerEmprunt);
router.delete("/:id", empruntsController.deleteEmprunt);

module.exports = router;
