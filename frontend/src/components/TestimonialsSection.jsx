import React, { useState, useEffect } from 'react';
import { getTestimonials } from '../services/api';
import { Star, Quote } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <section id="temoignages" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ce que disent nos <span className="text-yellow-600">clients</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            La satisfaction de nos clients est notre plus belle récompense. 
            Découvrez leurs témoignages sur nos prestations.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-600 mb-2">500+</div>
            <div className="text-gray-600">Événements réalisés</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-600 mb-2">98%</div>
            <div className="text-gray-600">Clients satisfaits</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-600 mb-2">10+</div>
            <div className="text-gray-600">Années d'expérience</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-600 mb-2">24/7</div>
            <div className="text-gray-600">Support client</div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <LoadingSpinner text="Chargement des témoignages..." />
        )}

        {/* Error State */}
        {error && (
          <ErrorMessage 
            error={error} 
            onRetry={fetchTestimonials}
            className="mb-8"
          />
        )}

        {/* No testimonials */}
        {!loading && !error && testimonials.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">Aucun témoignage disponible pour le moment.</p>
          </div>
        )}

        {/* Testimonials */}
        {!loading && !error && testimonials.length > 0 && (
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
              >
                {/* Quote icon */}
                <Quote className="w-10 h-10 text-yellow-600/20 absolute top-4 right-4" />
                
                {/* Stars */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>

                {/* Testimonial text */}
                <p className="text-gray-700 leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </p>

                {/* Client info */}
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-yellow-600">{testimonial.event}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trust badges */}
        <div className="mt-16 bg-white rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Pourquoi nous faire confiance ?
            </h3>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl">🏆</div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Professionnalisme</h4>
              <p className="text-gray-600 text-sm">Équipe expérimentée et matériel professionnel</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl">🎵</div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Personnalisation</h4>
              <p className="text-gray-600 text-sm">Chaque événement est unique et sur mesure</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl">📞</div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Support 24/7</h4>
              <p className="text-gray-600 text-sm">Assistance téléphonique disponible</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl">💎</div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Qualité Premium</h4>
              <p className="text-gray-600 text-sm">Équipement haut de gamme et finitions soignées</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;