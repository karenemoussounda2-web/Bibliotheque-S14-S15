# Application de gestion d'une bibliothèque de quartier

Projet Akieni Academy — Cohorte 2 (Semaines 14-15, Module 3).

## Installation

1. `cd backend && npm install`
2. Créer une base PostgreSQL `bibliotheque` et exécuter `schema.sql`
3. Copier `.env.example` en `.env` et renseigner vos identifiants
4. `npm run dev` → serveur sur http://localhost:3000
5. Ouvrir `frontend/index.html` dans le navigateur

## Modèle de données

4 tables : `auteurs`, `adherents`, `livres` (FK vers auteurs, statut `disponible`), `emprunts` (FK vers livres et adherents, `date_retour_effective` NULL = en cours). Le statut `disponible` du livre est mis à jour automatiquement à chaque emprunt/retour.

## Fonctionnement du site

L'interface est organisée en 4 sections accessibles depuis un menu de navigation :

- **Livres** : affiche la liste des livres avec l'auteur associé et le statut de disponibilité (disponible/emprunté). Une barre de recherche permet de filtrer par titre ou auteur, avec pagination si la liste est longue. Un formulaire permet d'ajouter un livre.
- **Adhérents** : affiche la liste des adhérents inscrits, avec un formulaire d'ajout. En cliquant sur un adhérent, on accède à son historique d'emprunts (en cours et passés).
- **Emprunts** : affiche les emprunts en cours et ceux en retard, distingués visuellement par une couleur différente. Un formulaire permet de créer un nouvel emprunt (sélection d'un livre disponible et d'un adhérent) ; un bouton permet d'enregistrer le retour d'un livre. Les erreurs (ex. livre déjà emprunté) s'affichent directement dans l'interface.
- **Tableau de bord** : affiche les statistiques globales — nombre total de livres, d'adhérents, d'emprunts en cours et en retard, le livre le plus emprunté et l'adhérent le plus actif.

Toutes les pages communiquent avec le backend via `fetch()` vers l'API Express, sans rechargement complet de la page pour les actions (ajout, retour, recherche).

## Stack

Node.js / Express / PostgreSQL (backend) — HTML/CSS/JS avec fetch() (frontend)
