# JSEVENT - Contrats API et Plan d'Intégration

## 📋 Données Mockées à Remplacer

### Frontend Mock Data (`/app/frontend/src/data/mockData.js`)
- `eventPackages` - Packages par type d'événement (mariage, anniversaire, baptême)
- `photoboothPackages` - 3 formules photobooth 
- `additionalServices` - Services complémentaires
- `testimonials` - Témoignages clients

## 🗄️ Modèles MongoDB

### 1. EventPackage
```javascript
{
  _id: ObjectId,
  id: String, // "mariage-bronze"
  name: String, // "PACK BRONZE" 
  type: String, // "mariage", "anniversaire", "bapteme"
  price: Number,
  features: [String],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. PhotoboothPackage
```javascript
{
  _id: ObjectId,
  id: String, // "photo-one"
  name: String, // "PHOTO ONE"
  price: Number,
  features: [String],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. AdditionalService
```javascript
{
  _id: ObjectId,
  id: String, // "mange-debout"
  name: String,
  price: Number,
  unit: String, // "pièce", "week-end"
  description: String,
  custom: Boolean, // pour personnalisation
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 4. ContactRequest
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  eventType: String,
  eventDate: Date,
  guests: Number,
  message: String,
  status: String, // "new", "contacted", "quoted", "closed"
  createdAt: Date,
  updatedAt: Date
}
```

### 5. Testimonial
```javascript
{
  _id: ObjectId,
  name: String,
  event: String,
  text: String,
  rating: Number,
  isApproved: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 6. Booking
```javascript
{
  _id: ObjectId,
  contactRequestId: ObjectId,
  packageId: String,
  packageType: String, // "event", "photobooth"
  totalPrice: Number,
  status: String, // "pending", "confirmed", "cancelled"
  eventDate: Date,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 Endpoints API à Créer

### Packages & Services
- `GET /api/packages/:type` - Récupérer packages par type (mariage, anniversaire, bapteme)
- `GET /api/packages` - Tous les packages actifs
- `GET /api/photobooth-packages` - Packages photobooth
- `GET /api/additional-services` - Services complémentaires

### Contact & Réservations  
- `POST /api/contact-request` - Soumettre demande de contact
- `POST /api/booking` - Créer une réservation
- `GET /api/booking/:id` - Détails d'une réservation

### Testimonials
- `GET /api/testimonials` - Témoignages approuvés
- `POST /api/testimonials` - Nouveau témoignage (à approuver)

### Admin (pour gestion future)
- `GET /api/admin/contact-requests` - Liste des demandes
- `PUT /api/admin/contact-requests/:id` - Mettre à jour statut
- `GET /api/admin/testimonials` - Gérer témoignages
- `PUT /api/admin/testimonials/:id` - Approuver/rejeter

## 🔄 Plan d'Intégration Frontend/Backend

### 1. Créer les Services API (frontend)
```javascript
// /app/frontend/src/services/api.js
const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api';

export const getEventPackages = async (type) => {
  const response = await axios.get(`${API_BASE}/packages/${type}`);
  return response.data;
};

export const getPhotoboothPackages = async () => {
  const response = await axios.get(`${API_BASE}/photobooth-packages`);
  return response.data;
};

export const submitContactRequest = async (formData) => {
  const response = await axios.post(`${API_BASE}/contact-request`, formData);
  return response.data;
};
```

### 2. Remplacer Mock Data dans les Composants

#### ServicesSection.jsx
- Remplacer `import { eventPackages } from '../data/mockData'`
- Par des appels API avec useState/useEffect
- Gérer loading states et erreurs

#### PhotoboothSection.jsx  
- Remplacer `import { photoboothPackages } from '../data/mockData'`
- Par appel API `getPhotoboothPackages()`

#### ContactSection.jsx
- Intégrer `submitContactRequest()` dans handleSubmit
- Gérer success/error states
- Validation côté client et serveur

#### TestimonialsSection.jsx
- Remplacer testimonials mock par API call
- Afficher seulement les témoignages approuvés

### 3. États de Loading & Erreurs
```javascript
const [packages, setPackages] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchPackages = async () => {
    try {
      setLoading(true);
      const data = await getEventPackages(selectedEventType);
      setPackages(data);
    } catch (err) {
      setError('Erreur lors du chargement des packages');
    } finally {
      setLoading(false);
    }
  };
  
  fetchPackages();
}, [selectedEventType]);
```

## 📧 Fonctionnalités Email (Future)
- Confirmation automatique client
- Notification admin pour nouvelle demande
- Templates personnalisés par type d'événement

## 🔐 Sécurité
- Validation des données d'entrée
- Rate limiting sur formulaires
- Sanitisation des inputs
- CORS configuré pour le frontend

## 📊 Métriques (Future)
- Tracking des demandes par type d'événement
- Taux de conversion devis → réservation
- Packages les plus populaires

## 🗂️ Fichiers à Modifier

### Backend (Nouveau)
- `/app/backend/models/` - Modèles Pydantic
- `/app/backend/routers/` - Routes API
- `/app/backend/services/` - Logique métier
- `/app/backend/server.py` - Mise à jour imports

### Frontend (Intégration)
- `/app/frontend/src/services/api.js` - Service API
- `/app/frontend/src/components/ServicesSection.jsx` - Intégrer API
- `/app/frontend/src/components/PhotoboothSection.jsx` - Intégrer API  
- `/app/frontend/src/components/ContactSection.jsx` - Intégrer API
- `/app/frontend/src/components/TestimonialsSection.jsx` - Intégrer API

## ✅ Ordre d'Implémentation

1. **Backend Models & Routes** - Créer modèles et endpoints API
2. **Test Backend** - Valider avec tests API
3. **Frontend Services** - Créer couche d'abstraction API
4. **Frontend Integration** - Remplacer mock data par API calls
5. **Error Handling** - Gérer loading/error states
6. **Final Testing** - Test intégration complète

## 📝 Notes Importantes
- Garder mockData.js temporairement pour fallback
- Implémenter progressive loading (skeleton screens)
- Prévoir cache côté frontend pour performances
- Structure modulaire pour faciliter maintenance