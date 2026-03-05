# Projet Configurateur PC (API + Frontend)

Application complète de configurateur PC avec Backend (Node/Express/Mongo) et Frontend (React/Vite), conteneurisée avec Docker.

## 🚀 Démarrage Rapide (Recommandé)

### 1. Prérequis
*   **Docker Desktop** doit être installé et **lancé** (attendre que l'icône ne bouge plus).

### 2. Installation & Lancement
Ouvrez un terminal (PowerShell ou CMD) et lancez les commandes suivantes :

```bash
# 1. Récupérer le projet
git clone https://github.com/LAJAVEL/projetAPI.git

# 2. Aller dans le dossier du projet
cd projetAPI
*(Si vous avez téléchargé le ZIP GitHub, le dossier s'appelle souvent `projetAPI-main`.)*

# 3. Lancer l'application
docker-compose up --build -d
```

*(Option : sans `-d` si vous préférez garder les logs dans le terminal : `docker-compose up --build`.)*

### 3. Initialisation (Important pour le prof)
Par défaut, la base de données est vide. Pour injecter le compte Admin et des données de démo, **ouvrez un deuxième terminal** et lancez :
```bash
docker-compose exec api node scripts/seed.js
```

### 4. Accès
Une fois les logs stabilisés et le seed effectué, ouvrez votre navigateur :
*   **Application** : [http://localhost](http://localhost)
*   **Admin** : [http://localhost/login](http://localhost/login) (Compte : `admin@admin.fr` / `admin123`, puis onglet Admin : `/admin`)
*   **API Docs** : [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

---

### 🆘 En cas de problème
*   **"no configuration file provided"** : Vérifiez que vous êtes bien dans le dossier du projet (là où est le fichier `docker-compose.yml`).
*   **Erreur connexion Admin** : Assurez-vous d'avoir lancé la commande `seed.js` ci-dessus.

---

## 🛠️ Développement (Sans Docker)

⚠️ **Important** : Cette méthode nécessite d'installer et de configurer MongoDB vous-même.

### Prérequis
*   Node.js (v14+)
*   Une instance **MongoDB** en cours d'exécution (soit installée localement, soit via MongoDB Atlas).

### 1. Backend (API)
1.  Créez un fichier `.env` à la racine du projet (à côté de `package.json`) avec le contenu suivant :
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/configurator_db
    JWT_SECRET=votre_secret_jwt
    ```
    *(Remplacez `mongodb://localhost:27017/configurator_db` par votre lien de connexion si vous utilisez Atlas ou une autre configuration)*.

2.  Installez et lancez :
    ```bash
    npm install
    npm start
    ```

### 2. Frontend (Client)
Dans un nouveau terminal :
```bash
cd client
npm install
npm run dev
```
L'interface sera accessible sur `http://localhost:5173`.

## ✅ Tests
Lancer les tests unitaires backend :
```bash
npm test
```

Lancer les tests dans Docker (recommandé si vous utilisez Docker Compose) :
```bash
docker-compose exec api npm test
```

---

## ✅ Validation du TP (ce qui a été fait)

### Technologies demandées
*   **API** : Node.js + Express + MongoDB → OK (voir `package.json`)
*   **BackOffice** : React → OK (client React dans `client/`)
*   **Authentification** : JWT → OK (voir `src/controllers/authController.js`)
*   **Tests** : Jest + Supertest → OK (voir `package.json`, tests dans `src/tests/`)

### Fonctionnel / Endpoints
*   **Catégories** : lister + CRUD admin → OK
*   **Composants** : lister + détail + CRUD admin → OK
*   **Partenaires** : lister + CRUD admin → OK
*   **Configurations** : créer + gérer plusieurs configs par utilisateur + export PDF → OK

### Documentation OpenAPI
*   Une doc machine-readable existe et couvre les endpoints (auth, catégories, composants, partenaires, configurations + PDF) → OK (`swagger.yaml` + UI dans `/api-docs`)

### Tests
*   Les tests passent via `npm test` (Jest + Supertest) → OK
