const API_URL = "http://localhost:3000";

async function chargerSelects() {
  const selectLivre = document.getElementById("emprunt-livre");
  const selectAdherent = document.getElementById("emprunt-adherent");

  const livresRes = await fetch(`${API_URL}/livres?limit=100`);
  const livresData = await livresRes.json();
  selectLivre.innerHTML = '<option value="">-- Choisir un livre --</option>';
  livresData.data
    .filter((l) => l.disponible)
    .forEach((l) => {
      selectLivre.innerHTML += `<option value="${l.id}">${l.titre}</option>`;
    });

  const adherentsRes = await fetch(`${API_URL}/adherents`);
  const adherents = await adherentsRes.json();
  selectAdherent.innerHTML =
    '<option value="">-- Choisir un adhérent --</option>';
  adherents.forEach((a) => {
    selectAdherent.innerHTML += `<option value="${a.id}">${a.nom}</option>`;
  });
}

document
  .getElementById("form-emprunt")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const errorZone = document.getElementById("error-zone");

    const livre_id = document.getElementById("emprunt-livre").value;
    const adherent_id = document.getElementById("emprunt-adherent").value;
    const date_retour_prevue = document.getElementById(
      "emprunt-date-retour",
    ).value;

    try {
      const response = await fetch(`${API_URL}/emprunts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ livre_id, adherent_id, date_retour_prevue }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.error || "Erreur lors de la création de l'emprunt",
        );

      document.getElementById("form-emprunt").reset();
      errorZone.innerHTML = "";
      chargerSelects(); // rafraîchit la liste (le livre emprunté disparaît des choix disponibles)
    } catch (err) {
      errorZone.innerHTML = `<div class="error-msg">${err.message}</div>`;
    }
  });
async function chargerEmprunts() {
  const errorZone = document.getElementById("error-zone");
  const tbody = document.getElementById("emprunts-tbody");

  try {
    const [enCoursRes, enRetardRes] = await Promise.all([
      fetch(`${API_URL}/emprunts/en-cours`),
      fetch(`${API_URL}/emprunts/en-retard`),
    ]);

    const enCours = await enCoursRes.json();
    const enRetard = await enRetardRes.json();

    // On récupère les id des emprunts en retard pour les repérer dans la liste "en cours"
    const idsEnRetard = new Set(enRetard.map((e) => e.id));

    tbody.innerHTML = "";

    if (enCours.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">Aucun emprunt en cours.</td></tr>';
      return;
    }

    enCours.forEach((e) => {
      const estEnRetard = idsEnRetard.has(e.id);
      const tr = document.createElement("tr");
      if (estEnRetard) tr.style.background = "#fdecea";

      tr.innerHTML = `
        <td>${e.titre}</td>
        <td>${e.adherent_nom}</td>
        <td>${e.date_retour_prevue}</td>
        <td>
          <span class="badge ${estEnRetard ? "emprunte" : "disponible"}">
            ${estEnRetard ? "En retard" : "En cours"}
          </span>
        </td>
        <td><button onclick="retournerLivre(${e.id})">Retourner</button></td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    errorZone.innerHTML = `<div class="error-msg">${err.message}</div>`;
  }
}

async function retournerLivre(empruntId) {
  const errorZone = document.getElementById("error-zone");
  try {
    const response = await fetch(`${API_URL}/emprunts/${empruntId}/retour`, {
      method: "PUT",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Erreur lors du retour");

    errorZone.innerHTML = "";
    chargerEmprunts(); // rafraîchit la liste des emprunts
    chargerSelects(); // rafraîchit le select des livres disponibles pour un nouvel emprunt
  } catch (err) {
    errorZone.innerHTML = `<div class="error-msg">${err.message}</div>`;
  }
}
chargerSelects();
chargerEmprunts();
