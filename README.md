# JSEVENT - Site Web d'Événementiel

## 📋 Description du Projet

Site web complet pour JSEVENT, société d'événementiel spécialisée dans les mariages, anniversaires et baptêmes.

## 🚀 Architecture Technique

### Frontend (React)
- **Framework**: React 19.0.0
- **Styling**: TailwindCSS avec composants Shadcn/ui
- **Routing**: React Router DOM
- **API**: Axios pour les appels HTTP
- **Authentification**: JWT avec context React

### Backend (FastAPI)
- **Framework**: FastAPI (Python)
- **Base de données**: MongoDB avec Motor (async)
- **Authentification**: JWT avec passlib/bcrypt
- **Upload**: Support images et vidéos (50MB max)
- **Validation**: Pydantic models

## 📦 Installation & Déploiement

### Prérequis
- Node.js (v18+)
- Python (v3.11+)
- MongoDB
- Yarn

### Installation Frontend
```bash
cd frontend
yarn install
yarn start  # Port 3000
```

### Installation Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows
pip install -r requirements.txt
python server.py  # Port 8001
```

### Variables d'Environnement

**Frontend (.env)**
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

**Backend (.env)**
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=jsevent
JWT_SECRET_KEY=your-secret-key-change-in-production
```

## 🔐 Administration

### Accès Admin
- **URL**: `/admin/login`
- **Username**: `admin`
- **Password**: `jsevent2025`

⚠️ **IMPORTANT**: Changez ces identifiants en production !

### Fonctionnalités Admin
- 📊 Dashboard avec statistiques
- 📞 Gestion des demandes de contact
- ⭐ Modération des témoignages
- 🖼️ Gestion de galerie (images/vidéos)
- 📤 Upload de fichiers avec drag & drop

## 🎯 Fonctionnalités Principales

### Site Public
- **Hero Section** avec logo animé
- **Services** : 3 types d'événements × 3 packs chacun
- **Photobooth** : 3 formules + services additionnels
- **Témoignages** clients avec notes
- **Formulaire de contact** fonctionnel
- **Design responsive** et moderne

### Services Proposés

#### 🎊 Événements
1. **Mariages** (450€ - 650€)
   - Pack Bronze, Argent, Or
   - DJ professionnel, sonorisation, éclairage
2. **Anniversaires** (350€ - 500€)
   - Animation complète, vidéo-projection
3. **Baptêmes** (350€ - 500€)
   - Sonorisation, effets lumineux

#### 📸 Photobooth
- **Photo One** (139€) : Photos illimitées + USB
- **Photo Two** (180€) : 200 tirages + extras
- **Photo Three** (249€) : 400 tirages + premium

#### 🎪 Services Additionnels
- Location mange debout (5€/pièce)
- Candy bar (15€/week-end)
- Personnalisation d'objets

## 📞 Contact

**JSEVENT**  
📧 contact@jsevent.fr  
📞 09 87 12 46 95  
📍 3 rue Georges Queva, 62218 Loison sous Lens, France  

## 🔧 Structure des Fichiers

```
/
├── frontend/
│   ├── src/
│   │   ├── components/           # Composants React
│   │   ├── pages/admin/         # Pages d'administration
│   │   ├── services/            # API calls
│   │   ├── contexts/            # React contexts
│   │   └── data/                # Mock data
│   └── public/                  # Assets statiques
├── backend/
│   ├── models/                  # Modèles Pydantic
│   ├── routers/                 # Routes API
│   ├── services/                # Services métier
│   └── server.py               # Serveur principal
├── uploads/                     # Fichiers uploadés
│   ├── image/                  # Images
│   └── video/                  # Vidéos
└── contracts.md                # Documentation API
```

## 🛡️ Sécurité

- **Authentification JWT** pour l'admin
- **Validation** stricte des uploads
- **Sanitisation** des inputs
- **Protection CORS**
- **Rate limiting** (à implémenter en production)

## 📈 Base de Données

### Collections MongoDB
- `event_packages` - Packages d'événements
- `photobooth_packages` - Formules photobooth  
- `additional_services` - Services additionnels
- `contact_requests` - Demandes de contact
- `testimonials` - Témoignages clients
- `gallery_items` - Galerie média
- `admin_users` - Utilisateurs administrateurs

## 🚀 Déploiement Production

### Liste de vérification
- [ ] Changer les mots de passe par défaut
- [ ] Configurer HTTPS
- [ ] Sauvegarder MongoDB
- [ ] Configurer les variables d'environnement
- [ ] Optimiser les images (WebP, compression)
- [ ] Ajouter monitoring et logs
- [ ] Tester les performances
- [ ] Configurer CDN pour les uploads

### Hébergement Recommandé
- **Frontend**: Vercel, Netlify, ou serveur statique
- **Backend**: VPS, DigitalOcean, ou services cloud
- **Base de données**: MongoDB Atlas ou instance dédiée
- **Fichiers**: Stockage local ou cloud (AWS S3)

## 📝 Notes Développement

Ce site a été développé avec les meilleures pratiques :
- Architecture modulaire et scalable
- Code documenté et maintenable
- Interface utilisateur moderne et intuitive
- API REST complète et sécurisée
- Gestion d'erreurs robuste
- Performance optimisée

**Version**: 1.0.0  
**Créé**: Juillet 2025  
**Stack**: React + FastAPI + MongoDB
