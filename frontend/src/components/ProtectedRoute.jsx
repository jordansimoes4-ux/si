import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner text="Vérification de l'authentification..." />
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;