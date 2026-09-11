const pool = require("../db");

exports.getStats = async (req, res, next) => {
  try {
    const totalLivres = await pool.query("SELECT COUNT(*) FROM livres");
    const totalAdherents = await pool.query("SELECT COUNT(*) FROM adherents");
    const empruntsEnCours = await pool.query(
      "SELECT COUNT(*) FROM emprunts WHERE date_retour_effective IS NULL",
    );
    const empruntsEnRetard = await pool.query(
      `SELECT COUNT(*) FROM emprunts 
       WHERE date_retour_effective IS NULL AND date_retour_prevue < NOW()`,
    );

    const livrePlusEmprunte = await pool.query(
      `SELECT l.titre, COUNT(*) AS nb_emprunts
       FROM emprunts e JOIN livres l ON e.livre_id = l.id
       GROUP BY l.id, l.titre
       ORDER BY nb_emprunts DESC LIMIT 1`,
    );

    const adherentPlusActif = await pool.query(
      `SELECT a.nom, COUNT(*) AS nb_emprunts
       FROM emprunts e JOIN adherents a ON e.adherent_id = a.id
       GROUP BY a.id, a.nom
       ORDER BY nb_emprunts DESC LIMIT 1`,
    );

    res.json({
      totalLivres: parseInt(totalLivres.rows[0].count),
      totalAdherents: parseInt(totalAdherents.rows[0].count),
      empruntsEnCours: parseInt(empruntsEnCours.rows[0].count),
      empruntsEnRetard: parseInt(empruntsEnRetard.rows[0].count),
      livrePlusEmprunte: livrePlusEmprunte.rows[0] || null,
      adherentPlusActif: adherentPlusActif.rows[0] || null,
    });
  } catch (err) {
    next(err);
  }
};
