const pool = require("../db");

// GET /auteurs — liste tous les auteurs
exports.getAllAuteurs = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM auteurs ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// GET /auteurs/:id — un seul auteur
exports.getAuteurById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM auteurs WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Auteur non trouvé" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// POST /auteurs — créer un auteur
exports.createAuteur = async (req, res, next) => {
  try {
    const { nom, nationalite } = req.body;
    if (!nom) {
      return res.status(400).json({ error: "Le nom est obligatoire" });
    }
    const result = await pool.query(
      "INSERT INTO auteurs (nom, nationalite) VALUES ($1, $2) RETURNING *",
      [nom, nationalite],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// PUT /auteurs/:id — modifier un auteur
exports.updateAuteur = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nom, nationalite } = req.body;
    const result = await pool.query(
      "UPDATE auteurs SET nom = $1, nationalite = $2 WHERE id = $3 RETURNING *",
      [nom, nationalite, id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Auteur non trouvé" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// DELETE /auteurs/:id — supprimer un auteur
exports.deleteAuteur = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM auteurs WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Auteur non trouvé" });
    }
    res.json({ message: "Auteur supprimé", auteur: result.rows[0] });
  } catch (err) {
    next(err);
  }
};
