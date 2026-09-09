CREATE TABLE auteurs (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    nationalite VARCHAR(100)
);

CREATE TABLE adherents (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    contact VARCHAR(150)
);

CREATE TABLE livres (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    annee_publication INT,
    auteur_id INT REFERENCES auteurs(id) ON DELETE SET NULL,
    disponible BOOLEAN DEFAULT TRUE
);

CREATE TABLE emprunts (
    id SERIAL PRIMARY KEY,
    livre_id INT REFERENCES livres(id) ON DELETE CASCADE,
    adherent_id INT REFERENCES adherents(id) ON DELETE CASCADE,
    date_emprunt TIMESTAMP DEFAULT NOW(),
    date_retour_prevue DATE NOT NULL,
    date_retour_effective TIMESTAMP
);