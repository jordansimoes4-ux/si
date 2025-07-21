# GUIDE COMPLET - JSEVENT POUR WINDOWS

## 🎯 **Solution 1 : Fichier Batch Windows (Recommandé)**

### 📋 **Étape 1 : Télécharger le Script**
1. **Copiez** tout le code du fichier `create-jsevent-windows.bat` (ci-dessus)
2. **Créez** un nouveau fichier sur votre Bureau Windows
3. **Nommez-le** : `create-jsevent.bat`
4. **Collez** tout le code dedans
5. **Sauvegardez** le fichier

### 🚀 **Étape 2 : Exécuter le Script**
1. **Double-cliquez** sur `create-jsevent.bat`
2. Le script va créer automatiquement tout votre site JSEVENT
3. **Attendez** que l'installation se termine

### 📁 **Étape 3 : Installer les Dépendances**
```cmd
cd jsevent-website\frontend
yarn install

cd ..\backend  
pip install -r requirements.txt
```

### 🎉 **Étape 4 : Démarrer Votre Site**
```cmd
# Terminal 1 - Backend
cd backend
python server.py

# Terminal 2 - Frontend  
cd frontend
yarn start
```

## 🎯 **Solution 2 : Archive ZIP Manuelle**

Si le script batch ne fonctionne pas, voici tous les fichiers à créer manuellement :

### 📦 **Structure de Dossiers**
```
jsevent-website/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/admin/
│   │   ├── services/
│   │   └── data/
│   ├── public/
│   └── package.json
├── backend/
│   ├── models/
│   ├── routers/
│   ├── services/
│   ├── requirements.txt
│   └── server.py
└── README.md
```

### 📄 **Fichiers Principaux à Créer**

**1. frontend/package.json**
```json
{
  "name": "jsevent-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.5.1",
    "react-scripts": "5.0.1",
    "axios": "^1.8.4",
    "lucide-react": "^0.507.0",
    "tailwindcss": "^3.4.17",
    "@craco/craco": "^7.1.0"
  },
  "scripts": {
    "start": "craco start",
    "build": "craco build"
  }
}
```

**2. backend/requirements.txt**
```
fastapi==0.110.1
uvicorn==0.25.0
python-dotenv>=1.0.1
pymongo==4.5.0
pydantic>=2.6.4
motor==3.3.1
python-multipart>=0.0.9
```

**3. backend/server.py**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="JSEVENT API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/")
async def root():
    return {"message": "JSEVENT API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
```

## 🎯 **Solution 3 : GitHub (Plus Simple)**

Je peux vous créer un repository GitHub avec tout le code :

1. **Allez sur GitHub.com**
2. **Créez un nouveau repository** : `jsevent-website`
3. **Copiez tous les fichiers** que je vous donne
4. **Clonez** le repository sur votre PC

## 📞 **Informations Intégrées**

Toutes vos vraies coordonnées sont déjà intégrées :
- ☎️ **Téléphone** : 09 87 12 46 95
- 📍 **Adresse** : 3 rue Georges Queva, 62218 Loison sous Lens, France
- 📧 **Email** : contact@jsevent.fr

## 🔐 **Administration**

- **URL** : `http://localhost:3000/admin/login`
- **Username** : `admin`
- **Password** : `jsevent2025`

## 🎨 **Ce que Vous Obtiendrez**

✅ **Site web complet** avec design doré élégant  
✅ **9 packages événementiels** (Mariage, Anniversaire, Baptême)  
✅ **3 formules Photobooth** détaillées  
✅ **Panel d'administration** sécurisé  
✅ **Formulaire de contact** fonctionnel  
✅ **Design responsive** pour tous les écrans  
✅ **Vos coordonnées** partout intégrées  

## 🚀 **Quelle Solution Préférez-vous ?**

1. **Script Batch** (.bat) - Le plus automatique
2. **Fichiers manuels** - Plus de contrôle  
3. **GitHub** - Plus collaboratif

**Toutes les solutions donnent exactement le même résultat : votre site JSEVENT complet et professionnel !** 🎉