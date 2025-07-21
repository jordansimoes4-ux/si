import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance for admin API
const adminClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add token
adminClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for auth errors
adminClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Authentication
export const login = async (username, password) => {
  try {
    const response = await adminClient.post('/auth/login', {
      username,
      password
    });
    
    const { access_token, expires_in } = response.data;
    localStorage.setItem('admin_token', access_token);
    
    // Get user info
    const userResponse = await adminClient.get('/auth/me');
    localStorage.setItem('admin_user', JSON.stringify(userResponse.data));
    
    return {
      token: access_token,
      user: userResponse.data,
      expiresIn: expires_in
    };
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Erreur de connexion');
  }
};

export const logout = async () => {
  try {
    await adminClient.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await adminClient.get('/auth/me');
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la récupération de l\'utilisateur');
  }
};

// Dashboard
export const getDashboardStats = async () => {
  try {
    const response = await adminClient.get('/admin/dashboard');
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors du chargement des statistiques');
  }
};

// Contact Requests
export const getContactRequests = async (status = null, limit = 50) => {
  try {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('limit', limit.toString());
    
    const response = await adminClient.get(`/admin/contact-requests?${params}`);
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors du chargement des demandes');
  }
};

export const updateContactRequest = async (requestId, updateData) => {
  try {
    const response = await adminClient.put(`/admin/contact-requests/${requestId}`, updateData);
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la mise à jour de la demande');
  }
};

// Testimonials
export const getAllTestimonials = async (approved = null) => {
  try {
    const params = new URLSearchParams();
    if (approved !== null) params.append('approved', approved.toString());
    
    const response = await adminClient.get(`/admin/testimonials?${params}`);
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors du chargement des témoignages');
  }
};

export const updateTestimonial = async (testimonialId, updateData) => {
  try {
    const response = await adminClient.put(`/admin/testimonials/${testimonialId}`, updateData);
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la mise à jour du témoignage');
  }
};

// Gallery
export const getGalleryItems = async () => {
  try {
    const response = await adminClient.get('/admin/gallery');
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors du chargement de la galerie');
  }
};

export const createGalleryItem = async (itemData) => {
  try {
    const response = await adminClient.post('/admin/gallery', itemData);
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la création de l\'élément');
  }
};

export const updateGalleryItem = async (itemId, updateData) => {
  try {
    const response = await adminClient.put(`/admin/gallery/${itemId}`, updateData);
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la mise à jour de l\'élément');
  }
};

export const deleteGalleryItem = async (itemId) => {
  try {
    const response = await adminClient.delete(`/admin/gallery/${itemId}`);
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la suppression de l\'élément');
  }
};

export default adminClient;