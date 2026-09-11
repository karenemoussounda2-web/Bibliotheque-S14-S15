const pool = require("../db");

// GET /livres — liste avec recherche + pagination + nom de l'auteur
exports.getAllLivres = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT l.*, a.nom AS auteur_nom
      FROM livres l
      LEFT JOIN auteurs a ON l.auteur_id = a.id
    `;
    let countQuery = `SELECT COUNT(*) FROM livres l LEFT JOIN auteurs a ON l.auteur_id = a.id`;
    const values = [];

    if (search) {
      query += ` WHERE l.titre ILIKE $1 OR a.nom ILIKE $1`;
      countQuery += ` WHERE l.titre ILIKE $1 OR a.nom ILIKE $1`;
      values.push(`%${search}%`);
    }

    query += ` ORDER BY l.id LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    const dataValues = [...values, limit, offset];

    const result = await pool.query(query, dataValues);
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      data: result.rows,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

// GET /livres/:id
exports.getLivreById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT l.*, a.nom AS auteur_nom FROM livres l
       LEFT JOIN auteurs a ON l.auteur_id = a.id
       WHERE l.id = $1`,
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Livre non trouvé" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// POST /livres
exports.createLivre = async (req, res, next) => {
  try {
    const { titre, annee_publication, auteur_id } = req.body;
    if (!titre) {
      return res.status(400).json({ error: "Le titre est obligatoire" });
    }
    const result = await pool.query(
      `INSERT INTO livres (titre, annee_publication, auteur_id, disponible)
       VALUES ($1, $2, $3, true) RETURNING *`,
      [titre, annee_publication, auteur_id],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// PUT /livres/:id
exports.updateLivre = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { titre, annee_publication, auteur_id } = req.body;
    const result = await pool.query(
      `UPDATE livres SET titre = $1, annee_publication = $2, auteur_id = $3
       WHERE id = $4 RETURNING *`,
      [titre, annee_publication, auteur_id, id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Livre non trouvé" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// DELETE /livres/:id
exports.deleteLivre = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM livres WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Livre non trouvé" });
    }
    res.json({ message: "Livre supprimé", livre: result.rows[0] });
  } catch (err) {
    next(err);
  }
};
