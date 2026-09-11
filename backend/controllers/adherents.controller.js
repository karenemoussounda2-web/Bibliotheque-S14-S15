const pool = require("../db");

// GET /adherents — liste tous les adhérents
exports.getAllAdherents = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM adherents ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// GET /adherents/:id — un seul adhérent
exports.getAdherentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM adherents WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Adhérent non trouvé" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// POST /adherents — créer un adhérent
exports.createAdherent = async (req, res, next) => {
  try {
    const { nom, contact } = req.body;
    if (!nom) {
      return res.status(400).json({ error: "Le nom est obligatoire" });
    }
    const result = await pool.query(
      "INSERT INTO adherents (nom, contact) VALUES ($1, $2) RETURNING *",
      [nom, contact],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// PUT /adherents/:id — modifier un adhérent
exports.updateAdherent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nom, contact } = req.body;
    const result = await pool.query(
      "UPDATE adherents SET nom = $1, contact = $2 WHERE id = $3 RETURNING *",
      [nom, contact, id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Adhérent non trouvé" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// DELETE /adherents/:id — supprimer un adhérent
exports.deleteAdherent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM adherents WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Adhérent non trouvé" });
    }
    res.json({ message: "Adhérent supprimé", adherent: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// GET /adherents/:id/emprunts — historique des emprunts d'un adhérent
// (à activer une fois la table "emprunts" créée, jeudi)
exports.getEmpruntsByAdherent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT e.*, l.titre 
       FROM emprunts e 
       JOIN livres l ON e.livre_id = l.id 
       WHERE e.adherent_id = $1 
       ORDER BY e.date_emprunt DESC`,
      [id],
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};
