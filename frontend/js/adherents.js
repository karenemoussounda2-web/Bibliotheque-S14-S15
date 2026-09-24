const API_URL = "http://localhost:3000";

async function chargerAdherents() {
  const erreurZone = document.getElementById("erreur-zone");
  const tbody = document.getElementById("adherents-tbody");

  try {
    const response = await fetch(`${API_URL}/adherents`);
    if (!response.ok) {
      throw new Error("Erreur lors du chargement des adhérents");
    }
    const adherents = await response.json();

    tbody.innerHTML = "";

    adherents.forEach((adherent) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${adherent.nom}</td>
        <td>${adherent.contact || "—"}</td>
        <td><button onclick="voirHistorique(${adherent.id})">Voir</button></td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    erreurZone.innerHTML = `<div class="error-msg">${err.message}</div>`;
  }
}

async function voirHistorique(adherentId) {
  const zone = document.getElementById("historique-zone");
  zone.innerHTML = "<p>Chargement...</p>";

  try {
    const response = await fetch(`${API_URL}/adherents/${adherentId}/emprunts`);
    if (!response.ok) {
      throw new Error("Erreur lors du chargement de l'historique");
    }
    const emprunts = await response.json();

    if (emprunts.length === 0) {
      zone.innerHTML = "<p>Aucun emprunt pour cet adhérent.</p>";
      return;
    }

    let html =
      "<h2>Historique des emprunts</h2><table><thead><tr><th>Livre</th><th>Date emprunt</th><th>Date retour prévue</th><th>Statut</th></tr></thead><tbody>";

    emprunts.forEach((e) => {
      const statut = e.date_retour_effective ? "Rendu" : "En cours";
      html += `
        <tr>
          <td>${e.titre}</td>
          <td>${new Date(e.date_emprunt).toLocaleDateString()}</td>
          <td>${e.date_retour_prevue}</td>
          <td>${statut}</td>
        </tr>
      `;
    });

    html += "</tbody></table>";
    zone.innerHTML = html;
  } catch (err) {
    zone.innerHTML = `<div class="error-msg">${err.message}</div>`;
  }
}
document
  .getElementById("form-adherent")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const erreurZone = document.getElementById("erreur-zone");
    const nom = document.getElementById("adherent-nom").value;
    const contact = document.getElementById("adherent-contact").value;

    try {
      const response = await fetch(`${API_URL}/adherents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, contact }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erreur lors de l'ajout");

      document.getElementById("form-adherent").reset();
      erreurZone.innerHTML = "";
      chargerAdherents();
    } catch (err) {
      erreurZone.innerHTML = `<div class="error-msg">${err.message}</div>`;
    }
  });
chargerAdherents();
