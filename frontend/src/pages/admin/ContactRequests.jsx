import React, { useState, useEffect } from 'react';
import { getContactRequests, updateContactRequest } from '../../services/adminApi';
import { 
  Mail, 
  Phone, 
  Calendar, 
  Users, 
  MessageSquare,
  Edit,
  Filter,
  Search
} from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const ContactRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRequest, setEditingRequest] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getContactRequests(statusFilter || null);
      setRequests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      await updateContactRequest(requestId, { status: newStatus });
      // Update local state
      setRequests(requests.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      ));
      setEditingRequest(null);
    } catch (err) {
      alert('Erreur lors de la mise à jour: ' + err.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'new': 'bg-blue-100 text-blue-800',
      'contacted': 'bg-yellow-100 text-yellow-800',
      'quoted': 'bg-purple-100 text-purple-800',
      'closed': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'new': 'Nouveau',
      'contacted': 'Contacté',
      'quoted': 'Devis envoyé',
      'closed': 'Fermé'
    };
    return labels[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifié';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Date invalide';
    }
  };

  const getEventTypeIcon = (eventType) => {
    const icons = {
      'mariage': '💍',
      'anniversaire': '🎂',
      'bapteme': '🕊️'
    };
    return icons[eventType] || '🎉';
  };

  // Filter requests based on search term
  const filteredRequests = requests.filter(request =>
    request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.event_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <LoadingSpinner text="Chargement des demandes..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <ErrorMessage error={error} onRetry={fetchRequests} />
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
              <h1 className="text-2xl font-bold text-gray-900">Demandes de contact</h1>
              <p className="text-gray-600">{requests.length} demande(s) au total</p>
            </div>
            
            {/* Filters */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              
              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-9 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Tous les statuts</option>
                  <option value="new">Nouveau</option>
                  <option value="contacted">Contacté</option>
                  <option value="quoted">Devis envoyé</option>
                  <option value="closed">Fermé</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune demande trouvée</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="text-2xl">
                          {getEventTypeIcon(request.event_type)}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {request.name}
                          </h3>
                          <p className="text-sm text-gray-500 capitalize">
                            {request.event_type}
                          </p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {getStatusLabel(request.status)}
                        </span>
                      </div>

                      {/* Contact Info */}
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <a href={`mailto:${request.email}`} className="hover:text-yellow-600">
                            {request.email}
                          </a>
                        </div>
                        
                        {request.phone && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4" />
                            <a href={`tel:${request.phone}`} className="hover:text-yellow-600">
                              {request.phone}
                            </a>
                          </div>
                        )}
                        
                        {request.event_date && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(request.event_date)}</span>
                          </div>
                        )}
                        
                        {request.guests && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Users className="h-4 w-4" />
                            <span>{request.guests} invités</span>
                          </div>
                        )}
                      </div>

                      {/* Message */}
                      {request.message && (
                        <div className="mb-4">
                          <div className="flex items-center space-x-2 text-sm font-medium text-gray-900 mb-2">
                            <MessageSquare className="h-4 w-4" />
                            <span>Message</span>
                          </div>
                          <p className="text-sm text-gray-700 bg-gray-50 rounded p-3">
                            {request.message}
                          </p>
                        </div>
                      )}

                      {/* Dates */}
                      <div className="text-xs text-gray-500">
                        Créé le {formatDate(request.created_at)} • 
                        Modifié le {formatDate(request.updated_at)}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="ml-6 flex-shrink-0">
                      {editingRequest === request.id ? (
                        <div className="space-y-2">
                          {['new', 'contacted', 'quoted', 'closed'].map((status) => (
                            <button
                              key={status}
                              onClick={() => handleStatusUpdate(request.id, status)}
                              className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                                request.status === status
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'hover:bg-gray-100'
                              }`}
                            >
                              {getStatusLabel(status)}
                            </button>
                          ))}
                          <button
                            onClick={() => setEditingRequest(null)}
                            className="block w-full text-left px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-md"
                          >
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingRequest(request.id)}
                          className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-md transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Modifier</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactRequests;