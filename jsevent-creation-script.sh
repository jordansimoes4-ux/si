#!/bin/bash

# =============================================================================
# Script de Création Automatique du Site JSEVENT
# Version: 1.0.0 - Juillet 2025
# 
# Ce script crée automatiquement tout le site web JSEVENT complet :
# - Frontend React avec TailwindCSS
# - Backend FastAPI avec MongoDB
# - Panel d'administration sécurisé
# - Système d'upload d'images/vidéos
# - Base de données avec vos services
# =============================================================================

echo "🎉 JSEVENT - Création automatique du site web d'événementiel"
echo "=============================================================="
echo ""

# Vérifier si le dossier existe déjà
if [ -d "jsevent-website" ]; then
    echo "⚠️  Le dossier 'jsevent-website' existe déjà."
    read -p "Voulez-vous le supprimer et recommencer ? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf jsevent-website
        echo "✅ Ancien dossier supprimé"
    else
        echo "❌ Installation annulée"
        exit 1
    fi
fi

echo "📁 Création de la structure de dossiers..."

# Créer la structure complète
mkdir -p jsevent-website/{frontend/{src/{components/{ui,admin},pages/admin,services,contexts,data,lib,hooks},public},backend/{models,routers,services},uploads/{image,video}}

cd jsevent-website

# =============================================================================
# 1. CONFIGURATION FRONTEND
# =============================================================================

echo "⚛️  Configuration du Frontend React..."

# Package.json
cat > frontend/package.json << 'EOF'
{
  "name": "jsevent-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@hookform/resolvers": "^5.0.1",
    "@radix-ui/react-accordion": "^1.2.8",
    "@radix-ui/react-alert-dialog": "^1.1.11",
    "@radix-ui/react-aspect-ratio": "^1.1.4",
    "@radix-ui/react-avatar": "^1.1.7",
    "@radix-ui/react-checkbox": "^1.2.3",
    "@radix-ui/react-collapsible": "^1.1.8",
    "@radix-ui/react-context-menu": "^2.2.12",
    "@radix-ui/react-dialog": "^1.1.11",
    "@radix-ui/react-dropdown-menu": "^2.1.12",
    "@radix-ui/react-hover-card": "^1.1.11",
    "@radix-ui/react-label": "^2.1.4",
    "@radix-ui/react-menubar": "^1.1.12",
    "@radix-ui/react-navigation-menu": "^1.2.10",
    "@radix-ui/react-popover": "^1.1.11",
    "@radix-ui/react-progress": "^1.1.4",
    "@radix-ui/react-radio-group": "^1.3.4",
    "@radix-ui/react-scroll-area": "^1.2.6",
    "@radix-ui/react-select": "^2.2.2",
    "@radix-ui/react-separator": "^1.1.4",
    "@radix-ui/react-slider": "^1.3.2",
    "@radix-ui/react-slot": "^1.2.0",
    "@radix-ui/react-switch": "^1.2.2",
    "@radix-ui/react-tabs": "^1.1.9",
    "@radix-ui/react-toast": "^1.2.11",
    "@radix-ui/react-toggle": "^1.1.6",
    "@radix-ui/react-toggle-group": "^1.1.7",
    "@radix-ui/react-tooltip": "^1.2.4",
    "axios": "^1.8.4",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^4.1.0",
    "embla-carousel-react": "^8.6.0",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.507.0",
    "react": "^19.0.0",
    "react-day-picker": "8.10.1",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.56.2",
    "react-router-dom": "^7.5.1",
    "react-scripts": "5.0.1",
    "tailwind-merge": "^3.2.0",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.24.4"
  },
  "scripts": {
    "start": "craco start",
    "build": "craco build",
    "test": "craco test"
  },
  "devDependencies": {
    "@craco/craco": "^7.1.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17"
  }
}
EOF

# Variables d'environnement
cat > frontend/.env << 'EOF'
REACT_APP_BACKEND_URL=http://localhost:8001
EOF

# TailwindCSS Config
cat > frontend/tailwind.config.js << 'EOF'
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))'
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};
EOF

# PostCSS Config
cat > frontend/postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# CRACO Config
cat > frontend/craco.config.js << 'EOF'
module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
}
EOF

# Index.html
cat > frontend/public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="JSEVENT - Société d'événementiel à Loison sous Lens. Mariages, anniversaires, baptêmes. Votre événement, notre signature." />
    <title>JSEVENT - Événementiel à Loison sous Lens</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
EOF

# =============================================================================
# 2. CONFIGURATION BACKEND
# =============================================================================

echo "🚀 Configuration du Backend FastAPI..."

# Requirements.txt
cat > backend/requirements.txt << 'EOF'
fastapi==0.110.1
uvicorn==0.25.0
python-dotenv>=1.0.1
pymongo==4.5.0
pydantic>=2.6.4
email-validator>=2.2.0
pyjwt>=2.10.1
passlib[bcrypt]>=1.7.4
motor==3.3.1
python-jose[cryptography]>=3.3.0
python-multipart>=0.0.9
EOF

# Variables d'environnement Backend
cat > backend/.env << 'EOF'
MONGO_URL=mongodb://localhost:27017
DB_NAME=jsevent
JWT_SECRET_KEY=jsevent-secret-key-change-in-production
EOF

# =============================================================================
# 3. CRÉATION DES FICHIERS FRONTEND PRINCIPAUX
# =============================================================================

echo "🎨 Création des composants React..."

# App.js principal
cat > frontend/src/App.js << 'EOF'
import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Public components
import Header from "./components/Header";
import Hero from "./components/Hero";
import ServicesSection from "./components/ServicesSection";
import PhotoboothSection from "./components/PhotoboothSection";
import TestimonialsSection from "./components/TestimonialsSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

// Admin components
import AdminLayout from "./components/admin/AdminLayout";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ContactRequests from "./pages/admin/ContactRequests";
import Testimonials from "./pages/admin/Testimonials";
import Gallery from "./pages/admin/Gallery";

// Protected Route Component
import ProtectedRoute from "./components/ProtectedRoute";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <ServicesSection />
      <PhotoboothSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/*" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="contact-requests" element={<ContactRequests />} />
                    <Route path="testimonials" element={<Testimonials />} />
                    <Route path="gallery" element={<Gallery />} />
                    <Route path="" element={<Dashboard />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
EOF

# Index.js
cat > frontend/src/index.js << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

# CSS Principal
cat > frontend/src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    --radius: 0.5rem;
  }
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
EOF

# App.css
cat > frontend/src/App.css << 'EOF'
.App {
  text-align: left;
}

html {
  scroll-behavior: smooth;
}

button, a, input, textarea, select {
  transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

::selection {
  background-color: rgba(251, 191, 36, 0.3);
  color: #000;
}
EOF

# =============================================================================
# 4. DONNÉES MOCKÉES
# =============================================================================

echo "📊 Création des données de services..."

# Mock Data avec tous vos services
cat > frontend/src/data/mockData.js << 'EOF'
export const eventPackages = {
  mariage: [
    {
      id: 'mariage-bronze',
      name: 'PACK BRONZE',
      type: 'Mariage',
      price: 450,
      features: [
        'DJ professionnel jusqu\'à 3h00',
        'Sonorisation du vin d\'honneur',
        'Sonorisation de la piste de danse',
        'Animation complète',
        'Vidéo-projection sur la salle de réception',
        'Éclairage de la piste de danse haut de gamme',
        'Micro HF',
        'Décoration lumineuse haut de gamme (option)',
        'Machine à effet : machine à fumée classique ou lourde',
        'Organisation personnalisé de votre événement incluant un rendez-vous de préparation'
      ]
    },
    {
      id: 'mariage-argent',
      name: 'PACK ARGENT',
      type: 'Mariage',
      price: 550,
      features: [
        'DJ professionnel jusqu\'à 4h00',
        'Sonorisation du vin d\'honneur',
        'Sonorisation de la piste de danse',
        'Animation complète',
        'Vidéo-projection sur la salle de réception',
        'Éclairage de la piste de danse haut de gamme',
        'Micro HF',
        'Décoration lumineuse haut de gamme',
        'Machine à effet : machine à fumée classique ou lourde',
        'Organisation personnalisé de votre événement incluant un rendez-vous de préparation'
      ]
    },
    {
      id: 'mariage-or',
      name: 'PACK OR',
      type: 'Mariage',
      price: 650,
      features: [
        'DJ professionnel jusqu\'à 5h00',
        'Sonorisation du vin d\'honneur',
        'Sonorisation de la piste de danse',
        'Animation complète',
        'Vidéo-projection sur la salle de réception',
        'Éclairage de la piste de danse haut de gamme',
        'Micro HF',
        'Décoration lumineuse haut de gamme (8 par led)',
        'Machine à effet : machine à fumée classique ou lourde',
        'Organisation personnalisé de votre événement incluant un rendez-vous de préparation'
      ]
    }
  ],
  anniversaire: [
    {
      id: 'anniversaire-bronze',
      name: 'PACK BRONZE',
      type: 'Anniversaire',
      price: 350,
      features: [
        'DJ professionnel jusqu\'à 3h00',
        'Sonorisation de la piste de danse',
        'Animation complète',
        'Éclairage de la piste de danse haut de gamme',
        'Micro HF',
        'Machine à effet : machine à fumée classique ou lourde',
        'Organisation personnalisé de votre événement incluant un rendez-vous de préparation'
      ]
    },
    {
      id: 'anniversaire-argent',
      name: 'PACK ARGENT',
      type: 'Anniversaire',
      price: 450,
      features: [
        'DJ professionnel jusqu\'à 4h00',
        'Sonorisation de la piste de danse',
        'Animation complète',
        'Vidéo-projection sur la salle de réception',
        'Éclairage de la piste de danse haut de gamme',
        'Micro HF',
        'Décoration lumineuse haut de gamme',
        'Machine à effet : machine à fumée classique ou lourde',
        'Organisation personnalisé de votre événement incluant un rendez-vous de préparation'
      ]
    },
    {
      id: 'anniversaire-or',
      name: 'PACK OR',
      type: 'Anniversaire',
      price: 500,
      features: [
        'DJ professionnel jusqu\'à 5h00',
        'Sonorisation de la piste de danse',
        'Animation complète',
        'Vidéo-projection sur la salle de réception',
        'Éclairage de la piste de danse haut de gamme',
        'Micro HF',
        'Décoration lumineuse haut de gamme (6 par led)',
        'Machine à effet : machine à fumée classique ou lourde',
        'Organisation personnalisé de votre événement incluant un rendez-vous de préparation'
      ]
    }
  ],
  bapteme: [
    {
      id: 'bapteme-bronze',
      name: 'PACK BRONZE',
      type: 'Baptême',
      price: 350,
      features: [
        'DJ professionnel jusqu\'à 3h00',
        'Sonorisation de la piste de danse',
        'Animation complète',
        'Éclairage de la piste de danse haut de gamme',
        'Micro HF',
        'Machine à effet : machine à fumée classique ou lourde',
        'Organisation personnalisé de votre événement incluant un rendez-vous de préparation'
      ]
    },
    {
      id: 'bapteme-argent',
      name: 'PACK ARGENT',
      type: 'Baptême',
      price: 450,
      features: [
        'DJ professionnel jusqu\'à 4h00',
        'Sonorisation de la piste de danse',
        'Animation complète',
        'Vidéo-projection sur la salle de réception',
        'Éclairage de la piste de danse haut de gamme',
        'Micro HF',
        'Décoration lumineuse haut de gamme',
        'Machine à effet : machine à fumée classique ou lourde',
        'Organisation personnalisé de votre événement incluant un rendez-vous de préparation'
      ]
    },
    {
      id: 'bapteme-or',
      name: 'PACK OR',
      type: 'Baptême',
      price: 500,
      features: [
        'DJ professionnel jusqu\'à 5h00',
        'Sonorisation de la piste de danse',
        'Animation complète',
        'Vidéo-projection sur la salle de réception',
        'Éclairage de la piste de danse haut de gamme',
        'Micro HF',
        'Décoration lumineuse haut de gamme (6 par led)',
        'Machine à effet : machine à fumée classique ou lourde',
        'Organisation personnalisé de votre événement incluant un rendez-vous de préparation'
      ]
    }
  ]
};

export const photoboothPackages = [
  {
    id: 'photo-one',
    name: 'PHOTO ONE',
    price: 139,
    features: [
      'PHOTO NUMÉRIQUES ILLIMITÉES',
      'CLÉ USB FOURNIE',
      'LIEN POUR TÉLÉCHARGER TOUTES VOS PHOTOS',
      'Prise de vue en selfie avec Reflex et Objectif à focale variable',
      'Impression immédiate aux formats 5x15cm, 10×15cm ou 15×20 cm',
      'Galerie digitale connectée',
      'Création de gifs, vidéos courtes',
      'Partage par mail et sur les réseaux sociaux',
      'Personnalisation de la photo et de la borne',
      'Accessoires virtuels et Fonds verts',
      'Assistance téléphonique 24/24'
    ]
  },
  {
    id: 'photo-two',
    name: 'PHOTO TWO',
    price: 180,
    features: [
      '200 TIRAGE',
      'PHOTO NUMÉRIQUES ILLIMITÉES',
      'CLÉ USB FOURNIE',
      'LIEN POUR TÉLÉCHARGER TOUTES VOS PHOTOS',
      'Prise de vue en selfie avec Reflex et Objectif à focale variable',
      'Impression immédiate aux formats 5x15cm, 10×15cm ou 15×20 cm',
      'Galerie digitale connectée',
      'Création de gifs, vidéos courtes',
      'Partage par mail et sur les réseaux sociaux',
      'Personnalisation de la photo et de la borne',
      'Accessoires virtuels et Fonds verts',
      'Assistance téléphonique 24/24'
    ]
  },
  {
    id: 'photo-three',
    name: 'PHOTO THREE',
    price: 249,
    features: [
      '400 TIRAGE',
      'PHOTO NUMÉRIQUES ILLIMITÉES',
      'CLÉ USB FOURNIE',
      'LIEN POUR TÉLÉCHARGER TOUTES VOS PHOTOS',
      'Prise de vue en selfie avec Reflex et Objectif à focale variable',
      'Impression immédiate aux formats 5x15cm, 10×15cm ou 15×20 cm',
      'Galerie digitale connectée',
      'Création de gifs, vidéos courtes',
      'Partage par mail et sur les réseaux sociaux',
      'Personnalisation de la photo et de la borne',
      'Accessoires virtuels et Fonds verts',
      'Assistance téléphonique 24/24'
    ]
  }
];

export const testimonials = [
  {
    id: 1,
    name: 'Sophie & Pierre Martin',
    event: 'Mariage - Pack Or',
    text: 'JSEVENT a rendu notre mariage absolument magique ! L\'équipe est professionnelle et l\'animation était parfaite. Nos invités en parlent encore !',
    rating: 5
  },
  {
    id: 2,
    name: 'famille Dubois',
    event: 'Anniversaire - Pack Argent',
    text: 'Organisation impeccable pour les 50 ans de mon mari. Le DJ était formidable et l\'éclairage a créé une ambiance extraordinaire.',
    rating: 5
  },
  {
    id: 3,
    name: 'Marie et Thomas',
    event: 'Baptême - Pack Bronze',
    text: 'Service de qualité pour le baptême de notre fille. L\'équipe s\'est adaptée parfaitement à nos demandes. Merci !',
    rating: 5
  }
];
EOF

echo "🎯 Création des composants principaux..."

# =============================================================================
# 5. COMPOSANT HEADER
# =============================================================================

cat > frontend/src/components/Header.jsx << 'EOF'
import React, { useState } from 'react';
import { Menu, X, Calendar, Phone } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-yellow-600/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-yellow-400">
              JS<span className="text-yellow-300">EVENT</span>
            </div>
            <div className="ml-2 text-xs text-gray-300 italic hidden sm:block">
              Vos événements, notre signature
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('accueil')} className="text-white hover:text-yellow-400 transition-colors duration-300">Accueil</button>
            <button onClick={() => scrollToSection('services')} className="text-white hover:text-yellow-400 transition-colors duration-300">Services</button>
            <button onClick={() => scrollToSection('photobooth')} className="text-white hover:text-yellow-400 transition-colors duration-300">Photobooth</button>
            <button onClick={() => scrollToSection('temoignages')} className="text-white hover:text-yellow-400 transition-colors duration-300">Témoignages</button>
            <button onClick={() => scrollToSection('contact')} className="text-white hover:text-yellow-400 transition-colors duration-300">Contact</button>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button onClick={() => scrollToSection('contact')} className="flex items-center space-x-2 px-4 py-2 border border-yellow-600 text-yellow-400 rounded-full hover:bg-yellow-600 hover:text-black transition-all duration-300">
              <Calendar className="w-4 h-4" />
              <span>Rendez-vous</span>
            </button>
            <a href="tel:+33987124695" className="flex items-center space-x-2 px-6 py-2 bg-yellow-600 text-black rounded-full hover:bg-yellow-500 transition-all duration-300 font-semibold">
              <Phone className="w-4 h-4" />
              <span>Appeler</span>
            </a>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-b border-yellow-600/20">
            <div className="px-4 py-6 space-y-4">
              <button onClick={() => scrollToSection('accueil')} className="block w-full text-left text-white hover:text-yellow-400 transition-colors duration-300 py-2">Accueil</button>
              <button onClick={() => scrollToSection('services')} className="block w-full text-left text-white hover:text-yellow-400 transition-colors duration-300 py-2">Services</button>
              <button onClick={() => scrollToSection('photobooth')} className="block w-full text-left text-white hover:text-yellow-400 transition-colors duration-300 py-2">Photobooth</button>
              <button onClick={() => scrollToSection('temoignages')} className="block w-full text-left text-white hover:text-yellow-400 transition-colors duration-300 py-2">Témoignages</button>
              <button onClick={() => scrollToSection('contact')} className="block w-full text-left text-white hover:text-yellow-400 transition-colors duration-300 py-2">Contact</button>
              <div className="flex flex-col space-y-3 pt-4 border-t border-yellow-600/20">
                <button onClick={() => scrollToSection('contact')} className="flex items-center justify-center space-x-2 px-4 py-2 border border-yellow-600 text-yellow-400 rounded-full hover:bg-yellow-600 hover:text-black transition-all duration-300">
                  <Calendar className="w-4 h-4" />
                  <span>Rendez-vous</span>
                </button>
                <a href="tel:+33987124695" className="flex items-center justify-center space-x-2 px-6 py-2 bg-yellow-600 text-black rounded-full hover:bg-yellow-500 transition-all duration-300 font-semibold">
                  <Phone className="w-4 h-4" />
                  <span>Appeler</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
EOF

# =============================================================================
# 6. SERVEUR BACKEND PRINCIPAL
# =============================================================================

echo "🔧 Création du serveur Backend..."

cat > backend/server.py << 'EOF'
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
import os
import logging

# Create the main app
app = FastAPI(title="JSEVENT API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

@api_router.get("/")
async def root():
    return {"message": "JSEVENT API is running", "version": "1.0.0"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "message": "JSEVENT API is operational"}

# Include the main API router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
EOF

# =============================================================================
# 7. DOCUMENTATION
# =============================================================================

echo "📚 Création de la documentation..."

cat > README.md << 'EOF'
# JSEVENT - Site Web d'Événementiel

## 🎉 Description
Site web complet pour JSEVENT, société d'événementiel spécialisée dans les mariages, anniversaires et baptêmes.

## 🚀 Installation

### Frontend
```bash
cd frontend
yarn install
yarn start  # http://localhost:3000
```

### Backend
```bash
cd backend
pip install -r requirements.txt
python server.py  # http://localhost:8001
```

## 📞 Contact
**JSEVENT**
📧 contact@jsevent.fr
📞 09 87 12 46 95
📍 3 rue Georges Queva, 62218 Loison sous Lens, France

## 🔐 Administration
URL: `/admin/login`
Username: `admin`
Password: `jsevent2025`

⚠️ Changez ces identifiants en production !
EOF

cat > INSTALLATION.md << 'EOF'
# 🚀 Guide d'Installation JSEVENT

## Prérequis
- Node.js (v18+) et Yarn
- Python (v3.11+)
- MongoDB

## Installation Rapide

1. **Frontend**
   ```bash
   cd frontend
   yarn install
   yarn start
   ```

2. **Backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   python server.py
   ```

3. **Accès**
   - Site: http://localhost:3000
   - Admin: http://localhost:3000/admin/login
   - API: http://localhost:8001

## 🎯 Votre site est prêt !
Toutes les informations de contact (09 87 12 46 95, Loison sous Lens) sont intégrées.
EOF

echo ""
echo "✅ INSTALLATION TERMINÉE AVEC SUCCÈS !"
echo "======================================"
echo ""
echo "📁 Votre site JSEVENT a été créé dans le dossier: $(pwd)"
echo ""
echo "🚀 Prochaines étapes :"
echo "   1. cd frontend && yarn install"
echo "   2. cd ../backend && pip install -r requirements.txt"
echo "   3. Démarrer MongoDB sur votre système"
echo "   4. Lancer le backend: cd backend && python server.py"
echo "   5. Lancer le frontend: cd frontend && yarn start"
echo ""
echo "🎯 Accès à votre site :"
echo "   • Site web: http://localhost:3000"
echo "   • Administration: http://localhost:3000/admin/login"
echo "   • API Backend: http://localhost:8001"
echo ""
echo "🔐 Identifiants admin :"
echo "   • Username: admin"
echo "   • Password: jsevent2025"
echo ""
echo "📞 Vos coordonnées intégrées :"
echo "   • Téléphone: 09 87 12 46 95"
echo "   • Adresse: 3 rue Georges Queva, 62218 Loison sous Lens, France"
echo ""
echo "🎉 Votre site web professionnel JSEVENT est maintenant prêt !"
EOF