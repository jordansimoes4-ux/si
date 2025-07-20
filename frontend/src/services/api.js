import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for logging
apiClient.interceptors.request.use((config) => {
  console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Event Packages API
export const getEventPackages = async (type) => {
  try {
    const response = await apiClient.get(`/packages/${type}`);
    return response.data;
  } catch (error) {
    throw new Error(`Erreur lors du chargement des packages ${type}: ${error.message}`);
  }
};

export const getAllEventPackages = async () => {
  try {
    const response = await apiClient.get('/packages');
    return response.data;
  } catch (error) {
    throw new Error(`Erreur lors du chargement des packages: ${error.message}`);
  }
};

// Photobooth Packages API
export const getPhotoboothPackages = async () => {
  try {
    const response = await apiClient.get('/photobooth-packages');
    return response.data;
  } catch (error) {
    throw new Error(`Erreur lors du chargement des packages photobooth: ${error.message}`);
  }
};

// Additional Services API
export const getAdditionalServices = async () => {
  try {
    const response = await apiClient.get('/additional-services');
    return response.data;
  } catch (error) {
    throw new Error(`Erreur lors du chargement des services additionnels: ${error.message}`);
  }
};

// Testimonials API
export const getTestimonials = async () => {
  try {
    const response = await apiClient.get('/testimonials');
    return response.data;
  } catch (error) {
    throw new Error(`Erreur lors du chargement des témoignages: ${error.message}`);
  }
};

export const createTestimonial = async (testimonialData) => {
  try {
    const response = await apiClient.post('/testimonials', testimonialData);
    return response.data;
  } catch (error) {
    throw new Error(`Erreur lors de la création du témoignage: ${error.message}`);
  }
};

// Contact Request API
export const submitContactRequest = async (formData) => {
  try {
    // Transform form data to match backend model
    const contactData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      event_type: formData.eventType,
      event_date: formData.eventDate || null,
      guests: formData.guests ? parseInt(formData.guests) : null,
      message: formData.message || null
    };

    const response = await apiClient.post('/contact-request', contactData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 422) {
      throw new Error('Veuillez vérifier les informations saisies');
    }
    throw new Error(`Erreur lors de l'envoi de votre demande: ${error.message}`);
  }
};

// Booking API
export const createBooking = async (bookingData) => {
  try {
    const response = await apiClient.post('/booking', bookingData);
    return response.data;
  } catch (error) {
    throw new Error(`Erreur lors de la création de la réservation: ${error.message}`);
  }
};

export const getBooking = async (bookingId) => {
  try {
    const response = await apiClient.get(`/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Erreur lors de la récupération de la réservation: ${error.message}`);
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    throw new Error(`Service indisponible: ${error.message}`);
  }
};

export default apiClient;