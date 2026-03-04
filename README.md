# Projet Configurateur PC (API + Frontend)

Application complète de configurateur PC avec Backend (Node/Express/Mongo) et Frontend (React/Vite), conteneurisée avec Docker.

##  Démarrage Rapide (Recommandé)

### 1. Prérequis
*   **Docker Desktop** doit être installé et **lancé** (attendre que l'icône ne bouge plus).

### 2. Installation & Lancement
Ouvrez un terminal (PowerShell ou CMD) et lancez les commandes suivantes :

```bash
# 1. Récupérer le projet
git clone https://github.com/LAJAVEL/projetAPI.git

# 2. Aller dans le dossier du projet
cd projetAPI
cd API_REST

# 3. Lancer l'application
docker-compose up --build
```

### 3. Initialisation (Important pour le prof)
Par défaut, la base de données est vide. Pour injecter le compte Admin et des données de démo, **ouvrez un deuxième terminal** et lancez :
```bash
docker-compose exec api node scripts/seed.js
```

### 4. Accès
Une fois les logs stabilisés et le seed effectué, ouvrez votre navigateur :
*   **Application** : [http://localhost](http://localhost)
*   **Admin** : [http://localhost/login](http://localhost/login) (Compte : `admin@admin.fr` / `admin123`)
*   **API Docs** : [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

---

###  En cas de problème
*   **"no configuration file provided"** : Vérifiez que vous êtes bien dans le dossier `API_REST` (là où est le fichier `docker-compose.yml`).
*   **Erreur connexion Admin** : Assurez-vous d'avoir lancé la commande `seed.js` ci-dessus.

---

## 🛠️ Développement (Sans Docker)
*   **Backend** : `npm install` puis `npm start` (port 5000)
*   **Frontend** : `cd client` puis `npm install` et `npm run dev` (port 5173)

##  Tests
Lancer les tests unitaires backend :
```bash
npm test
```
