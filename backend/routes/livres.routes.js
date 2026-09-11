const express = require("express");
const router = express.Router();
const livresController = require("../controllers/livres.controller");

router.get("/", livresController.getAllLivres);
router.get("/:id", livresController.getLivreById);
router.post("/", livresController.createLivre);
router.put("/:id", livresController.updateLivre);
router.delete("/:id", livresController.deleteLivre);

module.exports = router;
