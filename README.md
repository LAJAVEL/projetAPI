# Projet API REST - Configurateur PC

Ce projet est une API RESTful développée en Node.js, Express et MongoDB. Elle permet la gestion complète d'un configurateur de PC sur mesure (composants, catégories, utilisateurs, configurations).

## Fonctionnalités

L'API offre les services suivants :
*   **Authentification** : Inscription et connexion sécurisées via JWT (JSON Web Tokens).
*   **Gestion des Composants** : CRUD complet pour les catégories (CPU, GPU, etc.) et les composants matériels.
*   **Gestion des Partenaires** : Suivi des prix et liens vers les sites marchands partenaires.
*   **Configurations Utilisateur** : Création, sauvegarde et consultation de configurations PC personnalisées.
*   **Export PDF** : Génération automatique d'un devis au format PDF pour une configuration donnée.

## Prérequis

Pour exécuter ce projet localement, il est nécessaire d'avoir :
*   **Node.js** (version 14 ou supérieure).
*   **npm** (gestionnaire de paquets).
*   Un cluster **MongoDB Atlas** ou une instance MongoDB locale.

## Installation

1.  Cloner le dépôt Git :
    ```bash
    git clone https://github.com/LAJAVEL/projetAPI.git
    cd projetAPI
    ```

2.  Installer les dépendances du projet :
    ```bash
    npm install
    ```

3.  Configurer les variables d'environnement :
    *   Créer un fichier `.env` à la racine du projet.
    *   Ajouter les variables suivantes (remplacer par vos propres valeurs) :
        ```env
        PORT=5000
        MONGO_URI=votre_chaine_de_connexion_mongodb
        JWT_SECRET=votre_cle_secrete_jwt
        ```

## Démarrage

Pour lancer le serveur en mode développement (avec redémarrage automatique) :
```bash
npm run dev
```

Pour lancer le serveur en mode production :
```bash
npm start
```

Le serveur sera accessible par défaut sur `http://localhost:5000`.

## Documentation API

Une documentation complète et interactive (Swagger UI) est disponible une fois le serveur lancé à l'adresse suivante :

**`http://localhost:5000/api-docs`**

Cette interface permet de tester directement tous les endpoints de l'API.

## Tests

Des tests unitaires et d'intégration sont inclus pour vérifier le bon fonctionnement de l'API. Pour les exécuter :
```bash
npm test
```
