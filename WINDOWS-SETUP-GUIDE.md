# JSEVENT Website - Windows Setup Guide

This guide will help you set up the JSEVENT website on a Windows machine using the provided ZIP archive.

## Prerequisites

Before you begin, make sure you have the following installed on your Windows system:

1. **Node.js and npm** (version 18 or higher)
   - Download from: https://nodejs.org/
   - Choose the LTS version

2. **Python** (version 3.8 or higher)
   - Download from: https://python.org/downloads/
   - Make sure to check "Add Python to PATH" during installation

3. **MongoDB** (Community Edition)
   - Download from: https://www.mongodb.com/try/download/community
   - Follow the installation wizard
   - MongoDB Compass (GUI) is recommended for database management

4. **Git** (optional but recommended)
   - Download from: https://git-scm.com/download/win

## Installation Steps

### Step 1: Extract the ZIP File

1. Extract `jsevent-website-complete.zip` to your desired location (e.g., `C:\Projects\jsevent`)
2. Open Command Prompt or PowerShell as Administrator
3. Navigate to the extracted folder: `cd C:\Projects\jsevent`

### Step 2: Set up Backend

1. Navigate to the backend folder:
   ```cmd
   cd backend
   ```

2. Create a virtual environment:
   ```cmd
   python -m venv venv
   ```

3. Activate the virtual environment:
   ```cmd
   venv\Scripts\activate
   ```

4. Install Python dependencies:
   ```cmd
   pip install -r requirements.txt
   ```

5. Create environment file:
   ```cmd
   copy .env.example .env
   ```
   
6. Edit the `.env` file with your MongoDB connection string:
   ```
   MONGO_URL=mongodb://localhost:27017/jsevent_db
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

### Step 3: Set up Frontend

1. Open a new Command Prompt window
2. Navigate to the frontend folder:
   ```cmd
   cd C:\Projects\jsevent\frontend
   ```

3. Install Node.js dependencies:
   ```cmd
   npm install
   ```
   or if you have Yarn:
   ```cmd
   yarn install
   ```

4. Create environment file:
   ```cmd
   copy .env.example .env
   ```
   
5. Edit the `.env` file:
   ```
   REACT_APP_BACKEND_URL=http://localhost:8001
   ```

### Step 4: Initialize Database

1. Make sure MongoDB is running on your system
2. In the backend folder (with virtual environment activated):
   ```cmd
   python -c "from services.data_seeder import seed_data; seed_data()"
   python -c "from services.admin_seeder import create_admin_user; create_admin_user()"
   ```

### Step 5: Start the Application

1. **Start Backend Server** (in backend folder):
   ```cmd
   python server.py
   ```
   The backend will start on `http://localhost:8001`

2. **Start Frontend Server** (in a new terminal, in frontend folder):
   ```cmd
   npm start
   ```
   or
   ```cmd
   yarn start
   ```
   The frontend will start on `http://localhost:3000`

## Default Admin Credentials

- **Email**: admin@jsevent.com
- **Password**: admin123

⚠️ **Important**: Change these credentials after first login!

## Troubleshooting

### MongoDB Connection Issues

If you encounter MongoDB connection issues:

1. Make sure MongoDB service is running:
   - Open Services (services.msc)
   - Look for "MongoDB" service and start it if stopped

2. Check if MongoDB is accessible:
   ```cmd
   mongo
   ```
   or
   ```cmd
   mongosh
   ```

### Port Issues

If ports 3000 or 8001 are already in use:

1. **Frontend**: Modify `package.json` in frontend folder:
   ```json
   "start": "set PORT=3001 && react-scripts start"
   ```

2. **Backend**: Modify `server.py`:
   ```python
   uvicorn.run(app, host="0.0.0.0", port=8002)
   ```

### Python Virtual Environment Issues

If you have issues with virtual environment:

1. Delete the `venv` folder
2. Create a new one:
   ```cmd
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   ```

## Features Available

1. **Public Website**:
   - Event packages (Weddings, Birthdays, Baptisms)
   - Photobooth services
   - Contact form
   - Testimonials
   - Gallery

2. **Admin Panel** (http://localhost:3000/admin):
   - User management
   - Contact request handling
   - Testimonial moderation
   - Gallery management
   - File uploads

## Support

If you encounter any issues during setup:

1. Check the console logs for error messages
2. Ensure all prerequisites are properly installed
3. Verify MongoDB is running and accessible
4. Check that ports 3000 and 8001 are available

## File Structure

```
jsevent/
├── backend/           # FastAPI backend
├── frontend/          # React frontend
├── uploads/           # File storage
├── README.md          # Main documentation
├── contracts.md       # API documentation
└── INSTALLATION.md    # Detailed setup guide
```

Happy coding! 🚀