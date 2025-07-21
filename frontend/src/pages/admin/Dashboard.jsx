import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getDashboardStats } from '../../services/adminApi';
import { 
  Users, 
  MessageSquare, 
  Star, 
  Image, 
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifié';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Date invalide';
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'new': 'bg-blue-100 text-blue-800',
      'contacted': 'bg-yellow-100 text-yellow-800',
      'quoted': 'bg-purple-100 text-purple-800',
      'closed': 'bg-green-100 text-green-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      'new': 'Nouveau',
      'contacted': 'Contacté',
      'quoted': 'Devis envoyé',
      'closed': 'Fermé'
    };
    return statusLabels[status] || status;
  };

  const getEventTypeIcon = (eventType) => {
    const icons = {
      'mariage': '💍',
      'anniversaire': '🎂',
      'bapteme': '🕊️'
    };
    return icons[eventType] || '🎉';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <LoadingSpinner text="Chargement du tableau de bord..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <ErrorMessage error={error} onRetry={fetchStats} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
              <p className="text-gray-600">Bienvenue, {user?.username}</p>
            </div>
            <div className="text-sm text-gray-500">
              Dernière mise à jour : {new Date().toLocaleTimeString('fr-FR')}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Contact Requests */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Demandes de contact</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold text-gray-900">{stats?.total_contact_requests || 0}</p>
                  {stats?.pending_contact_requests > 0 && (
                    <span className="ml-2 text-sm font-medium text-orange-600">
                      +{stats.pending_contact_requests} en attente
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Témoignages</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold text-gray-900">{stats?.total_testimonials || 0}</p>
                  {stats?.pending_testimonials > 0 && (
                    <span className="ml-2 text-sm font-medium text-orange-600">
                      +{stats.pending_testimonials} à approuver
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <Image className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Éléments galerie</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.total_gallery_items || 0}</p>
              </div>
            </div>
          </div>

          {/* Bookings */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Réservations</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.total_bookings || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Requests */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Clock className="h-5 w-5 text-gray-500 mr-2" />
              Demandes récentes
            </h2>
          </div>
          
          {stats?.recent_requests && stats.recent_requests.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {stats.recent_requests.map((request) => (
                <div key={request.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {getEventTypeIcon(request.event_type)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {request.name}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">
                          {request.event_type}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {getStatusLabel(request.status)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(request.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p>Aucune demande récente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;