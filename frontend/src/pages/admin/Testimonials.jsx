import React, { useState, useEffect } from 'react';
import { getAllTestimonials, updateTestimonial } from '../../services/adminApi';
import { 
  Star, 
  Check, 
  X, 
  Filter,
  Search,
  MessageSquare
} from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'approved', 'pending'
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      let approved = null;
      if (filter === 'approved') approved = true;
      if (filter === 'pending') approved = false;
      
      const data = await getAllTestimonials(approved);
      setTestimonials(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [filter]);

  const handleApproval = async (testimonialId, isApproved) => {
    try {
      await updateTestimonial(testimonialId, { is_approved: isApproved });
      // Update local state
      setTestimonials(testimonials.map(testimonial =>
        testimonial.id === testimonialId 
          ? { ...testimonial, is_approved: isApproved }
          : testimonial
      ));
    } catch (err) {
      alert('Erreur lors de la mise à jour: ' + err.message);
    }
  };

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

  // Filter testimonials based on search term
  const filteredTestimonials = testimonials.filter(testimonial =>
    testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFilterCounts = () => {
    const all = testimonials.length;
    const approved = testimonials.filter(t => t.is_approved).length;
    const pending = testimonials.filter(t => !t.is_approved).length;
    return { all, approved, pending };
  };

  const counts = getFilterCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <LoadingSpinner text="Chargement des témoignages..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <ErrorMessage error={error} onRetry={fetchTestimonials} />
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
              <h1 className="text-2xl font-bold text-gray-900">Témoignages</h1>
              <p className="text-gray-600">{testimonials.length} témoignage(s) au total</p>
            </div>
            
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
          </div>

          {/* Filter Tabs */}
          <div className="mt-6 flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tous ({counts.all})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === 'approved'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Approuvés ({counts.approved})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === 'pending'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              En attente ({counts.pending})
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredTestimonials.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun témoignage trouvé</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg ${
                  testimonial.is_approved ? 'ring-2 ring-green-200' : 'ring-2 ring-yellow-200'
                }`}
              >
                {/* Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                    <div className="flex items-center">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{testimonial.event}</p>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    "{testimonial.text}"
                  </p>
                  
                  <div className="text-xs text-gray-500 mb-4">
                    Créé le {formatDate(testimonial.created_at)}
                  </div>

                  {/* Status and Actions */}
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      testimonial.is_approved
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {testimonial.is_approved ? 'Approuvé' : 'En attente'}
                    </span>

                    <div className="flex items-center space-x-2">
                      {!testimonial.is_approved && (
                        <button
                          onClick={() => handleApproval(testimonial.id, true)}
                          className="p-1.5 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                          title="Approuver"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      
                      {testimonial.is_approved && (
                        <button
                          onClick={() => handleApproval(testimonial.id, false)}
                          className="p-1.5 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                          title="Rejeter"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Testimonials;