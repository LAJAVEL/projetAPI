# API REST - Configurateur PC

Cette API permet de gérer les composants PC, les partenaires marchands, les utilisateurs et leurs configurations.

## Installation

1. Assurez-vous que MongoDB est installé et lancé sur le port 27017.
2. Installez les dépendances :
   ```bash
   npm install
   ```

## Démarrage

- Mode développement (avec redémarrage automatique) :
  ```bash
  npm run dev
  ```
- Mode production :
  ```bash
  npm start
  ```

Le serveur démarre sur `http://localhost:5000`.

## Documentation API

La documentation Swagger est disponible à l'adresse :
`http://localhost:5000/api-docs`

## Tests

Pour lancer les tests unitaires :
```bash
npm test
```

## Fonctionnalités

- **Authentification** : Inscription, Connexion (JWT).
- **Catégories** : CRUD (Admin).
- **Partenaires** : CRUD (Admin).
- **Composants** : CRUD, gestion des prix par partenaire, filtres (Admin/Public).
- **Configurations** : Création, Liste, Détail, Export PDF (User/Admin).

## Structure du projet

- `src/config` : Configuration DB.
- `src/controllers` : Logique métier.
- `src/middleware` : Auth et gestion des erreurs.
- `src/models` : Modèles Mongoose.
- `src/routes` : Définition des routes API.
- `src/utils` : Utilitaires (Générateur PDF).
- `swagger.yaml` : Définition OpenAPI.
