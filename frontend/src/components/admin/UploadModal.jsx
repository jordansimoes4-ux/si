import React, { useState, useRef, useEffect } from 'react';
import { uploadFile, getUploadInfo } from '../../services/adminApi';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Video, 
  FileText,
  Check,
  AlertCircle
} from 'lucide-react';

const UploadModal = ({ onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadInfo, setUploadInfo] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: '',
    is_featured: false
  });
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Fetch upload info
    const fetchInfo = async () => {
      try {
        const info = await getUploadInfo();
        setUploadInfo(info);
      } catch (err) {
        console.error('Error fetching upload info:', err);
      }
    };
    fetchInfo();
  }, []);

  const validateFile = (selectedFile) => {
    if (!uploadInfo) return true;

    // Check file size
    if (selectedFile.size > uploadInfo.max_file_size) {
      setError(`Fichier trop volumineux. Taille maximum: ${uploadInfo.max_file_size_mb}MB`);
      return false;
    }

    // Check file type
    const allowedTypes = [...uploadInfo.allowed_image_types, ...uploadInfo.allowed_video_types];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError(`Type de fichier non supporté. Types autorisés: ${allowedTypes.join(', ')}`);
      return false;
    }

    return true;
  };

  const handleFileSelect = (selectedFile) => {
    setError(null);
    
    if (!validateFile(selectedFile)) {
      return;
    }

    setFile(selectedFile);
    
    // Set default title from filename
    if (!formData.title) {
      const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
      setFormData(prev => ({ ...prev, title: nameWithoutExt }));
    }

    // Create preview
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    } else if (selectedFile.type.startsWith('video/')) {
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    if (!formData.title) {
      setError('Le titre est obligatoire');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const result = await uploadFile(file, formData);
      onSuccess(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = () => {
    if (!file) return <Upload className="h-12 w-12 text-gray-400" />;
    
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-12 w-12 text-blue-500" />;
    } else if (file.type.startsWith('video/')) {
      return <Video className="h-12 w-12 text-purple-500" />;
    } else {
      return <FileText className="h-12 w-12 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">Ajouter un fichier</h2>
          <button
            onClick={onClose}
            disabled={uploading}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-yellow-400 bg-yellow-50'
                : file
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 hover:border-yellow-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="space-y-4">
                {/* Preview */}
                {preview && (
                  <div className="max-w-xs mx-auto">
                    {file.type.startsWith('image/') ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-auto rounded-lg shadow-sm"
                      />
                    ) : (
                      <video
                        src={preview}
                        className="w-full h-auto rounded-lg shadow-sm"
                        controls
                      />
                    )}
                  </div>
                )}
                
                {/* File Info */}
                <div className="flex items-center justify-center space-x-3">
                  {getFileIcon()}
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                    setError(null);
                    fileInputRef.current.value = '';
                  }}
                  disabled={uploading}
                  className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  Changer de fichier
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {getFileIcon()}
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Glissez-déposez votre fichier ici
                  </p>
                  <p className="text-gray-600">ou</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                  >
                    Parcourir les fichiers
                  </button>
                </div>
                
                {uploadInfo && (
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Taille maximum: {uploadInfo.max_file_size_mb}MB</p>
                    <p>
                      Formats supportés: Images (JPEG, PNG, GIF, WebP), Vidéos (MP4, AVI, MOV, WebM)
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileInputChange}
            accept="image/*,video/*"
            className="hidden"
            disabled={uploading}
          />

          {/* Form Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Titre du fichier"
                required
                disabled={uploading}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                placeholder="Description optionnelle"
                disabled={uploading}
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
                disabled={uploading}
              >
                <option value="">Aucun</option>
                <option value="mariage">Mariage</option>
                <option value="anniversaire">Anniversaire</option>
                <option value="bapteme">Baptême</option>
              </select>
            </div>

            <div className="flex items-center justify-start">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                disabled={uploading}
              />
              <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">
                Mettre en avant
              </label>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={uploading || !file}
              className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Upload en cours...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Ajouter à la galerie
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;