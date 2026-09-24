const API_URL = "http://localhost:3000";

async function chargerStats() {
  const errorZone = document.getElementById("error-zone");
  const grid = document.getElementById("stats-grid");

  try {
    const response = await fetch(`${API_URL}/stats`);
    if (!response.ok)
      throw new Error("Erreur lors du chargement des statistiques");
    const stats = await response.json();

    grid.innerHTML = `
  <div class="stat-card total">
    <div class="value">${stats.totalLivres}</div>
    <div class="label">Livres au total</div>
  </div>
  <div class="stat-card adherents">
    <div class="value">${stats.totalAdherents}</div>
    <div class="label">Adhérents</div>
  </div>
  <div class="stat-card en-cours">
    <div class="value">${stats.empruntsEnCours}</div>
    <div class="label">Emprunts en cours</div>
  </div>
  <div class="stat-card en-retard">
    <div class="value">${stats.empruntsEnRetard}</div>
    <div class="label">Emprunts en retard</div>
  </div>
  <div class="stat-card">
    <div class="value">${stats.livrePlusEmprunte ? stats.livrePlusEmprunte.titre : "—"}</div>
    <div class="label">Livre le plus emprunté</div>
  </div>
  <div class="stat-card">
    <div class="value">${stats.adherentPlusActif ? stats.adherentPlusActif.nom : "—"}</div>
    <div class="label">Adhérent le plus actif</div>
  </div>
`;
  } catch (err) {
    errorZone.innerHTML = `<div class="error-msg">${err.message}</div>`;
  }
}

chargerStats();
