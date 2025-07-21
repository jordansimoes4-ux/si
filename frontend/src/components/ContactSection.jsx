import React, { useState } from 'react';
import { submitContactRequest } from '../services/api';
import { Phone, Mail, MapPin, Calendar, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    guests: '',
    message: ''
  });
  
  const [submitState, setSubmitState] = useState({
    isSubmitting: false,
    isSuccess: false,
    error: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (submitState.error) {
      setSubmitState(prev => ({ ...prev, error: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.eventType) {
      setSubmitState({
        isSubmitting: false,
        isSuccess: false,
        error: 'Veuillez remplir tous les champs obligatoires'
      });
      return;
    }

    setSubmitState({
      isSubmitting: true,
      isSuccess: false,
      error: null
    });

    try {
      await submitContactRequest(formData);
      
      setSubmitState({
        isSubmitting: false,
        isSuccess: true,
        error: null
      });
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitState({
          isSubmitting: false,
          isSuccess: false,
          error: null
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          eventType: '',
          eventDate: '',
          guests: '',
          message: ''
        });
      }, 3000);
      
    } catch (error) {
      setSubmitState({
        isSubmitting: false,
        isSuccess: false,
        error: error.message
      });
    }
  };

  // Success state display
  if (submitState.isSuccess) {
    return (
      <section id="contact" className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl font-bold text-white mb-4">Merci pour votre demande !</h2>
          <p className="text-xl text-gray-300 mb-4">
            Nous avons bien reçu votre message et nous vous recontacterons sous 24h.
          </p>
          <p className="text-sm text-gray-400">
            Vous allez être redirigé vers le formulaire dans quelques secondes...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Prenons <span className="text-yellow-400">Contact</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Prêt à organiser votre événement ? Contactez-nous pour discuter de vos besoins 
            et recevoir un devis personnalisé.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Contactez-nous</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Phone className="w-6 h-6 text-yellow-400" />
                  <div>
                    <div className="text-white font-semibold">Téléphone</div>
                    <a href="tel:+33987124695" className="text-gray-300 hover:text-yellow-400 transition-colors">
                      09 87 12 46 95
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Mail className="w-6 h-6 text-yellow-400" />
                  <div>
                    <div className="text-white font-semibold">Email</div>
                    <a href="mailto:contact@jsevent.fr" className="text-gray-300 hover:text-yellow-400 transition-colors">
                      contact@jsevent.fr
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <MapPin className="w-6 h-6 text-yellow-400" />
                  <div>
                    <div className="text-white font-semibold">Adresse</div>
                    <div className="text-gray-300">
                      3 rue Georges Queva<br />
                      62218 Loison sous Lens, France
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Horaires */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Clock className="w-6 h-6 text-yellow-400" />
                <span>Horaires d'ouverture</span>
              </h3>
              <div className="space-y-2 text-gray-300">
                <div className="flex justify-between">
                  <span>Lundi - Vendredi</span>
                  <span>9h00 - 19h00</span>
                </div>
                <div className="flex justify-between">
                  <span>Samedi</span>
                  <span>10h00 - 18h00</span>
                </div>
                <div className="flex justify-between">
                  <span>Dimanche</span>
                  <span>Sur rendez-vous</span>
                </div>
              </div>
            </div>

            {/* Emergency contact */}
            <div className="bg-yellow-600/10 border border-yellow-600/20 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-yellow-400 mb-2">
                Urgence événement
              </h4>
              <p className="text-gray-300 text-sm mb-3">
                Pour toute urgence le jour de votre événement :
              </p>
              <a 
                href="tel:+33612345678" 
                className="text-yellow-400 font-semibold text-lg hover:underline"
              >
                06 12 34 56 78
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <Calendar className="w-6 h-6 text-yellow-600" />
              <span>Demande de devis</span>
            </h3>

            {/* Error Message */}
            {submitState.error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-red-700">{submitState.error}</div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={submitState.isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Votre nom"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={submitState.isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="votre.email@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={submitState.isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="09 87 12 46 95"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type d'événement *
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    required
                    disabled={submitState.isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Sélectionnez...</option>
                    <option value="mariage">Mariage</option>
                    <option value="anniversaire">Anniversaire</option>
                    <option value="bapteme">Baptême</option>
                    <option value="autre">Autre événement</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date souhaitée
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    disabled={submitState.isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre d'invités
                  </label>
                  <input
                    type="number"
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    min="1"
                    disabled={submitState.isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Détails de votre événement
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  disabled={submitState.isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Décrivez-nous votre projet, vos besoins spécifiques, le lieu de réception..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitState.isSubmitting}
                className="w-full bg-yellow-600 text-white py-4 rounded-lg hover:bg-yellow-700 transition-colors font-semibold flex items-center justify-center space-x-2 group disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitState.isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    <span>Envoyer ma demande</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;