const pool = require("../db");

// POST /emprunts — créer un emprunt
exports.createEmprunt = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { livre_id, adherent_id, date_retour_prevue } = req.body;
    if (!livre_id || !adherent_id || !date_retour_prevue) {
      return res.status(400).json({
        error: "livre_id, adherent_id et date_retour_prevue sont obligatoires",
      });
    }

    await client.query("BEGIN");

    // Vérifier la disponibilité du livre
    const livreResult = await client.query(
      "SELECT * FROM livres WHERE id = $1",
      [livre_id],
    );
    if (livreResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Livre non trouvé" });
    }
    if (!livreResult.rows[0].disponible) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Ce livre est déjà emprunté" });
    }

    // Créer l'emprunt
    const empruntResult = await client.query(
      `INSERT INTO emprunts (livre_id, adherent_id, date_retour_prevue)
       VALUES ($1, $2, $3) RETURNING *`,
      [livre_id, adherent_id, date_retour_prevue],
    );

    // Marquer le livre comme emprunté
    await client.query("UPDATE livres SET disponible = false WHERE id = $1", [
      livre_id,
    ]);

    await client.query("COMMIT");
    res.status(201).json(empruntResult.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
};

// PUT emprunts id/retour — enregistrer le retour d'un livre
exports.retournerEmprunt = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    await client.query("BEGIN");

    const empruntResult = await client.query(
      "SELECT * FROM emprunts WHERE id = $1",
      [id],
    );
    if (empruntResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Emprunt non trouvé" });
    }
    if (empruntResult.rows[0].date_retour_effective) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Ce livre a déjà été rendu" });
    }

    const updated = await client.query(
      `UPDATE emprunts SET date_retour_effective = NOW() WHERE id = $1 RETURNING *`,
      [id],
    );

    await client.query("UPDATE livres SET disponible = true WHERE id = $1", [
      empruntResult.rows[0].livre_id,
    ]);

    await client.query("COMMIT");
    res.json(updated.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
};

// GET emprunts en-cours
exports.getEmpruntsEnCours = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT e.*, l.titre, a.nom AS adherent_nom
       FROM emprunts e
       JOIN livres l ON e.livre_id = l.id
       JOIN adherents a ON e.adherent_id = a.id
       WHERE e.date_retour_effective IS NULL
       ORDER BY e.date_retour_prevue`,
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// GET emprunts en-retard
exports.getEmpruntsEnRetard = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT e.*, l.titre, a.nom AS adherent_nom
       FROM emprunts e
       JOIN livres l ON e.livre_id = l.id
       JOIN adherents a ON e.adherent_id = a.id
       WHERE e.date_retour_effective IS NULL
       AND e.date_retour_prevue < NOW()
       ORDER BY e.date_retour_prevue`,
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// GET emprunts liste complète 
exports.getAllEmprunts = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT e.*, l.titre, a.nom AS adherent_nom
       FROM emprunts e
       JOIN livres l ON e.livre_id = l.id
       JOIN adherents a ON e.adherent_id = a.id
       ORDER BY e.date_emprunt DESC`,
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// DELETE emprunts avec id
exports.deleteEmprunt = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    await client.query('BEGIN');

    const empruntResult = await client.query('SELECT * FROM emprunts WHERE id = $1', [id]);
    if (empruntResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Emprunt non trouvé' });
    }

    // Si l'emprunt n'était pas encore rendu, on remet le livre disponible
    if (!empruntResult.rows[0].date_retour_effective) {
      await client.query(
        'UPDATE livres SET disponible = true WHERE id = $1',
        [empruntResult.rows[0].livre_id]
      );
    }

    const deleted = await client.query('DELETE FROM emprunts WHERE id = $1 RETURNING *', [id]);

    await client.query('COMMIT');
    res.json({ message: 'Emprunt supprimé', emprunt: deleted.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};