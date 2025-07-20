import React, { useState } from 'react';
import { photoboothPackages } from '../data/mockData';
import { Check, Camera, Image, Download, Smartphone } from 'lucide-react';

const PhotoboothSection = () => {
  const handlePhotoboothReservation = (pkg) => {
    // Mock reservation - in real app this would open a booking form
    alert(`Demande de réservation pour ${pkg.name} (${pkg.price}€). Un formulaire de contact s'ouvrira dans la version complète.`);
  };

  return (
    <section id="photobooth" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Camera className="w-12 h-12 text-yellow-600" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Photo<span className="text-yellow-600">booth</span>
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Immortalisez vos moments avec notre photobooth professionnel. 
            Photos illimitées, impressions instantanées et souvenirs numériques.
          </p>
        </div>

        {/* Features showcase */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="text-center p-6">
            <Camera className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Appareil Professionnel</h3>
            <p className="text-gray-600 text-sm">Reflex avec objectif à focale variable</p>
          </div>
          <div className="text-center p-6">
            <Image className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Effets & Filtres</h3>
            <p className="text-gray-600 text-sm">Fonds verts et accessoires virtuels</p>
          </div>
          <div className="text-center p-6">
            <Download className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Téléchargement</h3>
            <p className="text-gray-600 text-sm">Toutes vos photos sur clé USB</p>
          </div>
          <div className="text-center p-6">
            <Smartphone className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Partage Social</h3>
            <p className="text-gray-600 text-sm">Partage instantané sur les réseaux</p>
          </div>
        </div>

        {/* Package Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {photoboothPackages.map((pkg, index) => (
            <div
              key={pkg.id}
              className={`relative bg-gray-50 rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 ${
                index === 1 ? 'bg-yellow-50 border-2 border-yellow-200' : ''
              }`}
            >
              {/* Header */}
              <div className="bg-white p-6 text-center border-b">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                <div className="text-4xl font-bold text-yellow-600">
                  {pkg.price}€
                </div>
              </div>

              {/* Features */}
              <div className="p-6">
                <ul className="space-y-3">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className={`text-sm leading-relaxed ${
                        feature.includes('TIRAGE') || feature.includes('NUMÉRIQUES') || feature.includes('USB')
                          ? 'font-semibold text-yellow-700'
                          : 'text-gray-700'
                      }`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => handlePhotoboothReservation(pkg)}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                    index === 1
                      ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                      : 'bg-gray-900 text-white hover:bg-yellow-600'
                  }`}
                >
                  <Camera className="w-5 h-5" />
                  <span>Choisir cette formule</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Services */}
        <div className="mt-16 bg-gray-900 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Services Complémentaires
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-xl p-6 text-center">
              <div className="text-3xl mb-4">🥂</div>
              <h4 className="text-xl font-semibold text-white mb-2">Location mange debout</h4>
              <p className="text-gray-300 text-sm mb-4">Tables hautes élégantes</p>
              <div className="text-yellow-400 font-bold text-lg">5€ / pièce</div>
            </div>
            
            <div className="bg-white/10 rounded-xl p-6 text-center">
              <div className="text-3xl mb-4">🍭</div>
              <h4 className="text-xl font-semibold text-white mb-2">Candy bar</h4>
              <p className="text-gray-300 text-sm mb-4">Bar à bonbons personnalisé</p>
              <div className="text-yellow-400 font-bold text-lg">15€ / week-end</div>
            </div>
            
            <div className="bg-white/10 rounded-xl p-6 text-center">
              <div className="text-3xl mb-4">🎁</div>
              <h4 className="text-xl font-semibold text-white mb-2">Personnalisation</h4>
              <p className="text-gray-300 text-sm mb-4">Gobelets, souvenirs, etc.</p>
              <div className="text-yellow-400 font-bold text-lg">Sur devis</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhotoboothSection;