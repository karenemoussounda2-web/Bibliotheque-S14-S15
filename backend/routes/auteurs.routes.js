const express = require("express");
const router = express.Router();
const auteursController = require("../controllers/auteurs.controller");

router.get("/", auteursController.getAllAuteurs);
router.get("/:id", auteursController.getAuteurById);
router.post("/", auteursController.createAuteur);
router.put("/:id", auteursController.updateAuteur);
router.delete("/:id", auteursController.deleteAuteur);

module.exports = router;
