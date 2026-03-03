# Projet API REST - Configurateur PC

Ce projet est une application complète (Backend + Frontend) permettant la gestion d'un configurateur de PC sur mesure. Il inclut une API RESTful (Node.js/Express/MongoDB) et une interface utilisateur moderne (React/Vite).

## 🚀 Démarrage Rapide (Recommandé avec Docker)

La méthode la plus simple pour lancer le projet est d'utiliser Docker. Cela installe et configure automatiquement la base de données, l'API et l'interface utilisateur.

### Prérequis
*   **Docker** et **Docker Compose** installés sur votre machine.

### Lancement
1.  Cloner le dépôt :
    ```bash
    git clone https://github.com/LAJAVEL/projetAPI.git
    cd projetAPI
    ```

2.  Lancer l'application :
    ```bash
    docker-compose up --build
    ```

### Accès
Une fois lancé, vous pouvez accéder aux services suivants :

*   **Interface Utilisateur (Frontend)** : [http://localhost](http://localhost) (ou http://localhost:80)
*   **Documentation API (Swagger UI)** : [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
*   **API REST** : [http://localhost:5000](http://localhost:5000)

---

## 🛠️ Installation Manuelle (Sans Docker)

Si vous préférez installer les composants manuellement :

### Prérequis
*   Node.js (v14+)
*   MongoDB (local ou Atlas)

### 1. Backend (API)
```bash
# Installation
npm install

# Configuration (.env à la racine)
# PORT=5000
# MONGO_URI=votre_uri_mongodb

# Démarrage
npm start
```

### 2. Frontend (Client)
```bash
cd client

# Installation
npm install

# Démarrage (Développement)
npm run dev
```
L'interface sera accessible sur `http://localhost:5173`.

## Fonctionnalités Principales

*   **Interface Utilisateur** : Design épuré ("Noir sur Blanc"), tableau de bord, configurateur interactif.
*   **Authentification** : Inscription et connexion sécurisées.
*   **Configurateur** : Sélection de composants par catégorie, calcul du prix en temps réel, sauvegarde des configurations.
*   **API** : Documentation Swagger complète, CRUD composants/utilisateurs/configurations.

## Tests
Pour exécuter les tests du backend :
```bash
npm test
```
