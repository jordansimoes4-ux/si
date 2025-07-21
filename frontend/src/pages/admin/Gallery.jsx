import React, { useState, useEffect } from 'react';
import { 
  getGalleryItems, 
  updateGalleryItem, 
  deleteGalleryItem 
} from '../../services/adminApi';
import { 
  Image as ImageIcon, 
  Video, 
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Star,
  Upload,
  X,
  Check
} from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import UploadModal from '../../components/admin/UploadModal';

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'image', 'video'
  const [eventFilter, setEventFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getGalleryItems();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleItemUpdate = async (itemId, updateData) => {
    try {
      const updatedItem = await updateGalleryItem(itemId, updateData);
      setItems(items.map(item => 
        item.id === itemId ? updatedItem : item
      ));
      setEditingItem(null);
    } catch (err) {
      alert('Erreur lors de la mise à jour: ' + err.message);
    }
  };

  const handleItemDelete = async (itemId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      return;
    }

    try {
      await deleteGalleryItem(itemId);
      setItems(items.filter(item => item.id !== itemId));
    } catch (err) {
      alert('Erreur lors de la suppression: ' + err.message);
    }
  };

  const handleUploadSuccess = (newItem) => {
    setItems([newItem, ...items]);
    setShowUploadModal(false);
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

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || item.file_type === typeFilter;
    const matchesEvent = eventFilter === 'all' || item.event_type === eventFilter;
    
    return matchesSearch && matchesType && matchesEvent;
  });

  const getCounts = () => {
    const total = items.length;
    const images = items.filter(item => item.file_type === 'image').length;
    const videos = items.filter(item => item.file_type === 'video').length;
    const featured = items.filter(item => item.is_featured).length;
    return { total, images, videos, featured };
  };

  const counts = getCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <LoadingSpinner text="Chargement de la galerie..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <ErrorMessage error={error} onRetry={fetchItems} />
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
              <h1 className="text-2xl font-bold text-gray-900">Galerie</h1>
              <p className="text-gray-600">
                {counts.total} élément(s) • {counts.images} image(s) • {counts.videos} vidéo(s)
              </p>
            </div>
            
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Ajouter un fichier</span>
            </button>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
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

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="all">Tous les types</option>
              <option value="image">Images</option>
              <option value="video">Vidéos</option>
            </select>

            {/* Event Filter */}
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="all">Tous les événements</option>
              <option value="mariage">Mariage</option>
              <option value="anniversaire">Anniversaire</option>
              <option value="bapteme">Baptême</option>
            </select>

            {/* Featured count */}
            <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-md text-sm">
              <Star className="h-4 w-4" />
              <span>{counts.featured} mis en avant</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              {items.length === 0 ? "Aucun élément dans la galerie" : "Aucun élément trouvé"}
            </p>
            {items.length === 0 && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span>Ajouter le premier fichier</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Media Preview */}
                <div className="relative aspect-video bg-gray-100 flex items-center justify-center">
                  {item.file_type === 'image' ? (
                    <img
                      src={`${process.env.REACT_APP_BACKEND_URL}${item.file_url}`}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : (
                    <video
                      src={`${process.env.REACT_APP_BACKEND_URL}${item.file_url}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  )}
                  
                  {/* Fallback for broken media */}
                  <div className="hidden w-full h-full items-center justify-center bg-gray-200">
                    {item.file_type === 'image' ? (
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    ) : (
                      <Video className="h-12 w-12 text-gray-400" />
                    )}
                  </div>

                  {/* Featured indicator */}
                  {item.is_featured && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Mis en avant
                    </div>
                  )}

                  {/* Type indicator */}
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center">
                    {item.file_type === 'image' ? (
                      <ImageIcon className="h-3 w-3 mr-1" />
                    ) : (
                      <Video className="h-3 w-3 mr-1" />
                    )}
                    {item.file_type}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                    {item.event_type && (
                      <span className="text-lg ml-2 flex-shrink-0">
                        {getEventTypeIcon(item.event_type)}
                      </span>
                    )}
                  </div>
                  
                  {item.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  
                  <div className="text-xs text-gray-500 mb-3">
                    Ajouté le {formatDate(item.created_at)}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleItemDelete(item.id)}
                        className="p-1.5 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleItemUpdate(item.id, { is_featured: !item.is_featured })}
                      className={`p-1.5 rounded-full transition-colors ${
                        item.is_featured
                          ? 'text-yellow-600 bg-yellow-100 hover:bg-yellow-200'
                          : 'text-gray-400 hover:bg-gray-100 hover:text-yellow-600'
                      }`}
                      title={item.is_featured ? "Retirer de la mise en avant" : "Mettre en avant"}
                    >
                      <Star className={`h-4 w-4 ${item.is_featured ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      )}

      {/* Edit Modal */}
      {editingItem && (
        <EditItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={(updateData) => handleItemUpdate(editingItem.id, updateData)}
        />
      )}
    </div>
  );
};

// Edit Item Modal Component
const EditItemModal = ({ item, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: item.title || '',
    description: item.description || '',
    event_type: item.event_type || '',
    is_featured: item.is_featured || false
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
    } catch (error) {
      alert('Erreur: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Modifier l'élément</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            disabled={saving}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              required
              disabled={saving}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
              disabled={saving}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type d'événement
            </label>
            <select
              value={formData.event_type}
              onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              disabled={saving}
            >
              <option value="">Aucun</option>
              <option value="mariage">Mariage</option>
              <option value="anniversaire">Anniversaire</option>
              <option value="bapteme">Baptême</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
              disabled={saving}
            />
            <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">
              Mettre en avant
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Enregistrement...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Enregistrer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Gallery;