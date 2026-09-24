const express = require("express");
const cors = require("cors");
const pool = require("./db");
const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");

const auteursRoutes = require("./routes/auteurs.routes");
const adherentsRoutes = require("./routes/adherents.routes");
const livresRoutes = require("./routes/livres.routes");
const empruntsRoutes = require("./routes/emprunts.routes");
const statsRoutes = require("./routes/stats.routes");

const app = express();
app.use(cors());

app.use(express.json());
app.use(logger);

app.get("/test-db", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Connexion réussie",
      heure_serveur: result.rows[0].now,
    });
  } catch (err) {
    next(err);
  }
});

app.use("/auteurs", auteursRoutes);
app.use("/adherents", adherentsRoutes);
app.use("/livres", livresRoutes);
app.use("/emprunts", empruntsRoutes);
app.use("/stats", statsRoutes);

// Middleware d'erreurs
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
