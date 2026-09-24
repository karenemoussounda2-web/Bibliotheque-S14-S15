const API_URL = "http://localhost:3000";
let currentPage = 1;
const limit = 5;

async function chargerLivres(search = "", page = 1) {
  const erreurZone = document.getElementById("erreur-zone");
  const tbody = document.getElementById("livres-tbody");

  try {
    const params = new URLSearchParams({ page, limit });
    if (search) params.append("search", search);

    const response = await fetch(`${API_URL}/livres?${params}`);
    if (!response.ok) throw new Error("Erreur lors du chargement des livres");
    const result = await response.json();

    tbody.innerHTML = "";
    result.data.forEach((livre) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${livre.titre}</td>
        <td>${livre.auteur_nom || "—"}</td>
        <td>${livre.annee_publication || "—"}</td>
        <td>
          <span class="badge ${livre.disponible ? "disponible" : "emprunte"}">
            ${livre.disponible ? "Disponible" : "Emprunté"}
          </span>
        </td>
      `;
      tbody.appendChild(tr);
    });

    currentPage = result.page;
    erreurZone.innerHTML = "";
  } catch (err) {
    erreurZone.innerHTML = `<div class="error-msg">${err.message}</div>`;
  }
}

async function chargerAuteursDansSelect() {
  const select = document.getElementById("livre-auteur");
  try {
    const response = await fetch(`${API_URL}/auteurs`);
    const auteurs = await response.json();
    select.innerHTML = '<option value="">-- Choisir un auteur --</option>';
    auteurs.forEach((a) => {
      select.innerHTML += `<option value="${a.id}">${a.nom}</option>`;
      currentPage = result.page;
      document.getElementById("page-info").textContent =
        `Page ${result.page} / ${result.totalPages}`;
      document.getElementById("btn-prev").disabled = result.page <= 1;
      document.getElementById("btn-next").disabled =
        result.page >= result.totalPages;

      errorZone.innerHTML = "";
    });
  } catch (err) {
    console.error(err);
  }
}

document.getElementById("form-livre").addEventListener("submit", async (e) => {
  e.preventDefault();
  const erreurZone = document.getElementById("erreur-zone");

  const titre = document.getElementById("livre-titre").value;
  const annee_publication =
    document.getElementById("livre-annee").value || null;
  const auteur_id = document.getElementById("livre-auteur").value || null;

  try {
    const response = await fetch(`${API_URL}/livres`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titre, annee_publication, auteur_id }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erreur lors de l'ajout du livre");
    }

    document.getElementById("form-livre").reset();
    erreurZone.innerHTML = "";
    chargerLivres();
  } catch (err) {
    erreurZone.innerHTML = `<div class="error-msg">${err.message}</div>`;
  }
});

function rechercherLivres() {
  const search = document.getElementById("search-input").value;
  chargerLivres(search, 1);
}
function pagePrecedente() {
  const search = document.getElementById("search-input").value;
  if (currentPage > 1) chargerLivres(search, currentPage - 1);
}

function pageSuivante() {
  const search = document.getElementById("search-input").value;
  chargerLivres(search, currentPage + 1);
}
rechercherLivres();
pageSuivante();
pagePrecedente();
chargerLivres();
chargerAuteursDansSelect();
