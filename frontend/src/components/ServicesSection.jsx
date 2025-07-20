import React, { useState, useEffect } from 'react';
import { getEventPackages } from '../services/api';
import { Check, Star, Calendar, Music } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const ServicesSection = () => {
  const [selectedEventType, setSelectedEventType] = useState('mariage');
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const eventTypes = [
    { key: 'mariage', name: 'Mariage', icon: '💍', color: 'from-pink-600 to-purple-600' },
    { key: 'anniversaire', name: 'Anniversaire', icon: '🎂', color: 'from-blue-600 to-cyan-600' },
    { key: 'bapteme', name: 'Baptême', icon: '🕊️', color: 'from-green-600 to-teal-600' }
  ];

  const fetchPackages = async (eventType) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEventPackages(eventType);
      setPackages(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching packages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages(selectedEventType);
  }, [selectedEventType]);

  const getPackageColor = (packageName) => {
    if (packageName.includes('BRONZE')) return 'from-amber-600 to-orange-600';
    if (packageName.includes('ARGENT')) return 'from-gray-400 to-gray-600';
    if (packageName.includes('OR')) return 'from-yellow-500 to-yellow-600';
    return 'from-yellow-500 to-yellow-600';
  };

  const handleReservation = (packageInfo) => {
    // Mock reservation - in real app this would open a booking form
    alert(`Demande de réservation pour ${packageInfo.name} - ${packageInfo.type} (${packageInfo.price}€). Un formulaire de contact s'ouvrira dans la version complète.`);
  };

  const handleEventTypeChange = (newType) => {
    setSelectedEventType(newType);
  };

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Nos <span className="text-yellow-600">Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Des formules adaptées à chaque événement, pour faire de vos moments spéciaux des souvenirs inoubliables
          </p>
        </div>

        {/* Event Type Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {eventTypes.map((type) => (
            <button
              key={type.key}
              onClick={() => handleEventTypeChange(type.key)}
              disabled={loading}
              className={`flex items-center space-x-3 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedEventType === type.key
                  ? 'bg-yellow-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="text-2xl">{type.icon}</span>
              <span>{type.name}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading && (
          <LoadingSpinner text={`Chargement des packages ${eventTypes.find(t => t.key === selectedEventType)?.name}...`} />
        )}

        {error && (
          <ErrorMessage 
            error={error} 
            onRetry={() => fetchPackages(selectedEventType)}
            className="mb-8"
          />
        )}

        {!loading && !error && packages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">Aucun package disponible pour ce type d'événement.</p>
          </div>
        )}

        {!loading && !error && packages.length > 0 && (
          <>
            {/* Package Cards */}
            <div className="grid md:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <div
                  key={pkg.id}
                  className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 ${
                    index === 1 ? 'md:scale-110 z-10' : ''
                  }`}
                >
                  {/* Popular badge for middle package */}
                  {index === 1 && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-600 text-white px-4 py-1 rounded-full text-sm font-semibold z-20">
                      <Star className="w-4 h-4 inline mr-1" />
                      Populaire
                    </div>
                  )}

                  {/* Header with gradient */}
                  <div className={`bg-gradient-to-r ${getPackageColor(pkg.name)} p-6 text-white`}>
                    <h3 className="text-2xl font-bold text-center">{pkg.name}</h3>
                    <div className="text-center mt-4">
                      <span className="text-sm opacity-90">À partir de</span>
                      <div className="text-4xl font-bold">{pkg.price}€</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="p-6">
                    <ul className="space-y-3">
                      {pkg.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-3">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="p-6 pt-0">
                    <button
                      onClick={() => handleReservation(pkg)}
                      className="w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-yellow-600 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 group"
                    >
                      <Calendar className="w-5 h-5 group-hover:animate-pulse" />
                      <span>Réserver ce pack</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Info */}
            <div className="mt-16 bg-black rounded-2xl p-8 text-center">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <Music className="w-8 h-8 text-yellow-400" />
                <h3 className="text-2xl font-bold text-white">Animation Professionnelle</h3>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed max-w-4xl mx-auto">
                Nos DJ professionnels et notre équipement haut de gamme garantissent une animation 
                de qualité pour votre événement. Sonorisation, éclairage, effets visuels - 
                tout est pensé pour créer l'ambiance parfaite.
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;