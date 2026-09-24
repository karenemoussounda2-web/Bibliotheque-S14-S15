const express = require("express");
const router = express.Router();
const adherentsController = require("../controllers/adherents.controller");
router.get("/:id/emprunts", adherentsController.getEmpruntsByAdherent);
router.get("/", adherentsController.getAllAdherents);
router.get("/:id", adherentsController.getAdherentById);
router.post("/", adherentsController.createAdherent);
router.put("/:id", adherentsController.updateAdherent);
router.delete("/:id", adherentsController.deleteAdherent);

module.exports = router;
  