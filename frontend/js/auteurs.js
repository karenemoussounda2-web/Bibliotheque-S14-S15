const API_URL = "http://localhost:3000";

async function chargerAuteurs() {
  const errorZone = document.getElementById("error-zone");
  const tbody = document.getElementById("auteurs-tbody");
  try {
    const response = await fetch(`${API_URL}/auteurs`);
    const auteurs = await response.json();
    tbody.innerHTML = "";
    auteurs.forEach((a) => {
      tbody.innerHTML += `<tr><td>${a.nom}</td><td>${a.nationalite || "—"}</td></tr>`;
    });
  } catch (err) {
    errorZone.innerHTML = `<div class="error-msg">${err.message}</div>`;
  }
}

document.getElementById("form-auteur").addEventListener("submit", async (e) => {
  e.preventDefault();
  const errorZone = document.getElementById("error-zone");
  const nom = document.getElementById("auteur-nom").value;
  const nationalite = document.getElementById("auteur-nationalite").value;

  try {
    const response = await fetch(`${API_URL}/auteurs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, nationalite }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Erreur lors de l'ajout");

    document.getElementById("form-auteur").reset();
    errorZone.innerHTML = "";
    chargerAuteurs();
  } catch (err) {
    errorZone.innerHTML = `<div class="error-msg">${err.message}</div>`;
  }
});

chargerAuteurs();
