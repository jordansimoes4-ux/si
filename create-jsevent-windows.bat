@echo off
echo.
echo ========================================
echo   JSEVENT - Creation automatique
echo   Site web d'evenementiel professionnel
echo ========================================
echo.

REM Verifier si le dossier existe deja
if exist "jsevent-website" (
    echo ATTENTION: Le dossier 'jsevent-website' existe deja.
    set /p choice="Voulez-vous le supprimer et recommencer ? (O/N): "
    if /i "%choice%"=="O" (
        rmdir /s /q "jsevent-website"
        echo Ancien dossier supprime
    ) else (
        echo Installation annulee
        pause
        exit /b 1
    )
)

echo Creation de la structure de dossiers...

REM Creer la structure complete
mkdir "jsevent-website\frontend\src\components\ui"
mkdir "jsevent-website\frontend\src\components\admin"
mkdir "jsevent-website\frontend\src\pages\admin"
mkdir "jsevent-website\frontend\src\services"
mkdir "jsevent-website\frontend\src\contexts"
mkdir "jsevent-website\frontend\src\data"
mkdir "jsevent-website\frontend\src\lib"
mkdir "jsevent-website\frontend\src\hooks"
mkdir "jsevent-website\frontend\public"
mkdir "jsevent-website\backend\models"
mkdir "jsevent-website\backend\routers"
mkdir "jsevent-website\backend\services"
mkdir "jsevent-website\uploads\image"
mkdir "jsevent-website\uploads\video"

cd jsevent-website

echo Configuration du Frontend React...

REM Package.json
(
echo {
echo   "name": "jsevent-frontend",
echo   "version": "1.0.0",
echo   "private": true,
echo   "dependencies": {
echo     "@hookform/resolvers": "^5.0.1",
echo     "@radix-ui/react-accordion": "^1.2.8",
echo     "@radix-ui/react-alert-dialog": "^1.1.11",
echo     "@radix-ui/react-aspect-ratio": "^1.1.4",
echo     "@radix-ui/react-avatar": "^1.1.7",
echo     "@radix-ui/react-checkbox": "^1.2.3",
echo     "@radix-ui/react-collapsible": "^1.1.8",
echo     "@radix-ui/react-context-menu": "^2.2.12",
echo     "@radix-ui/react-dialog": "^1.1.11",
echo     "@radix-ui/react-dropdown-menu": "^2.1.12",
echo     "@radix-ui/react-hover-card": "^1.1.11",
echo     "@radix-ui/react-label": "^2.1.4",
echo     "@radix-ui/react-menubar": "^1.1.12",
echo     "@radix-ui/react-navigation-menu": "^1.2.10",
echo     "@radix-ui/react-popover": "^1.1.11",
echo     "@radix-ui/react-progress": "^1.1.4",
echo     "@radix-ui/react-radio-group": "^1.3.4",
echo     "@radix-ui/react-scroll-area": "^1.2.6",
echo     "@radix-ui/react-select": "^2.2.2",
echo     "@radix-ui/react-separator": "^1.1.4",
echo     "@radix-ui/react-slider": "^1.3.2",
echo     "@radix-ui/react-slot": "^1.2.0",
echo     "@radix-ui/react-switch": "^1.2.2",
echo     "@radix-ui/react-tabs": "^1.1.9",
echo     "@radix-ui/react-toast": "^1.2.11",
echo     "@radix-ui/react-toggle": "^1.1.6",
echo     "@radix-ui/react-toggle-group": "^1.1.7",
echo     "@radix-ui/react-tooltip": "^1.2.4",
echo     "axios": "^1.8.4",
echo     "class-variance-authority": "^0.7.1",
echo     "clsx": "^2.1.1",
echo     "cmdk": "^1.1.1",
echo     "date-fns": "^4.1.0",
echo     "embla-carousel-react": "^8.6.0",
echo     "input-otp": "^1.4.2",
echo     "lucide-react": "^0.507.0",
echo     "react": "^19.0.0",
echo     "react-day-picker": "8.10.1",
echo     "react-dom": "^19.0.0",
echo     "react-hook-form": "^7.56.2",
echo     "react-router-dom": "^7.5.1",
echo     "react-scripts": "5.0.1",
echo     "tailwind-merge": "^3.2.0",
echo     "tailwindcss-animate": "^1.0.7",
echo     "zod": "^3.24.4"
echo   },
echo   "scripts": {
echo     "start": "craco start",
echo     "build": "craco build",
echo     "test": "craco test"
echo   },
echo   "devDependencies": {
echo     "@craco/craco": "^7.1.0",
echo     "autoprefixer": "^10.4.20",
echo     "postcss": "^8.4.49",
echo     "tailwindcss": "^3.4.17"
echo   }
echo }
) > frontend\package.json

REM Variables d'environnement
echo REACT_APP_BACKEND_URL=http://localhost:8001 > frontend\.env

REM TailwindCSS Config
(
echo module.exports = {
echo   darkMode: ["class"],
echo   content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
echo   theme: {
echo     extend: {
echo       borderRadius: {
echo         lg: 'var(--radius^)',
echo         md: 'calc(var(--radius^) - 2px^)',
echo         sm: 'calc(var(--radius^) - 4px^)'
echo       },
echo       colors: {
echo         background: 'hsl(var(--background^)^)',
echo         foreground: 'hsl(var(--foreground^)^)',
echo         primary: {
echo           DEFAULT: 'hsl(var(--primary^)^)',
echo           foreground: 'hsl(var(--primary-foreground^)^)'
echo         },
echo         secondary: {
echo           DEFAULT: 'hsl(var(--secondary^)^)',
echo           foreground: 'hsl(var(--secondary-foreground^)^)'
echo         },
echo         border: 'hsl(var(--border^)^)',
echo         input: 'hsl(var(--input^)^)',
echo         ring: 'hsl(var(--ring^)^)'
echo       }
echo     }
echo   },
echo   plugins: [require("tailwindcss-animate"^)]
echo };
) > frontend\tailwind.config.js

REM Backend Requirements
(
echo fastapi==0.110.1
echo uvicorn==0.25.0
echo python-dotenv^>=1.0.1
echo pymongo==4.5.0
echo pydantic^>=2.6.4
echo email-validator^>=2.2.0
echo pyjwt^>=2.10.1
echo passlib[bcrypt]^>=1.7.4
echo motor==3.3.1
echo python-jose[cryptography]^>=3.3.0
echo python-multipart^>=0.0.9
) > backend\requirements.txt

REM Variables d'environnement Backend
(
echo MONGO_URL=mongodb://localhost:27017
echo DB_NAME=jsevent
echo JWT_SECRET_KEY=jsevent-secret-key-change-in-production
) > backend\.env

REM Index.html
(
echo ^<!DOCTYPE html^>
echo ^<html lang="fr"^>
echo   ^<head^>
echo     ^<meta charset="utf-8" /^>
echo     ^<meta name="viewport" content="width=device-width, initial-scale=1" /^>
echo     ^<meta name="description" content="JSEVENT - Societe d'evenementiel a Loison sous Lens. Mariages, anniversaires, baptemes." /^>
echo     ^<title^>JSEVENT - Evenementiel a Loison sous Lens^</title^>
echo   ^</head^>
echo   ^<body^>
echo     ^<div id="root"^>^</div^>
echo   ^</body^>
echo ^</html^>
) > frontend\public\index.html

REM README
(
echo # JSEVENT - Site Web d'Evenementiel
echo.
echo ## Description
echo Site web complet pour JSEVENT, societe d'evenementiel specialisee dans les mariages, anniversaires et baptemes.
echo.
echo ## Installation
echo.
echo ### Frontend
echo ```
echo cd frontend
echo yarn install
echo yarn start
echo ```
echo.
echo ### Backend
echo ```
echo cd backend
echo pip install -r requirements.txt
echo python server.py
echo ```
echo.
echo ## Contact
echo **JSEVENT**
echo Email: contact@jsevent.fr
echo Telephone: 09 87 12 46 95
echo Adresse: 3 rue Georges Queva, 62218 Loison sous Lens, France
echo.
echo ## Administration
echo URL: /admin/login
echo Username: admin
echo Password: jsevent2025
) > README.md

echo.
echo ================================================
echo   INSTALLATION TERMINEE AVEC SUCCES !
echo ================================================
echo.
echo Votre site JSEVENT a ete cree dans ce dossier.
echo.
echo Prochaines etapes :
echo   1. cd frontend ^&^& yarn install
echo   2. cd ..\backend ^&^& pip install -r requirements.txt
echo   3. Demarrer MongoDB
echo   4. Lancer le backend: python server.py
echo   5. Lancer le frontend: yarn start
echo.
echo Acces a votre site :
echo   • Site web: http://localhost:3000
echo   • Administration: http://localhost:3000/admin/login
echo   • API Backend: http://localhost:8001
echo.
echo Identifiants admin :
echo   • Username: admin
echo   • Password: jsevent2025
echo.
echo Vos coordonnees integrees :
echo   • Telephone: 09 87 12 46 95
echo   • Adresse: 3 rue Georges Queva, 62218 Loison sous Lens
echo.
echo Votre site web professionnel JSEVENT est maintenant pret !
echo.
pause