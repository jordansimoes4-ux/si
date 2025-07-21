import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Heart } from 'lucide-react';

const Footer = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-black text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-6">
              <div className="text-3xl font-bold text-yellow-400">
                JS<span className="text-yellow-300">EVENT</span>
              </div>
            </div>
            <p className="text-gray-400 mb-4 italic">
              Vos événements, notre signature
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Depuis plus de 10 ans, nous créons des moments inoubliables pour vos événements les plus précieux.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Nos Services</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                >
                  Animation Mariage
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                >
                  Animation Anniversaire
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                >
                  Animation Baptême
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('photobooth')}
                  className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                >
                  Photobooth
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('photobooth')}
                  className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                >
                  Location matériel
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('photobooth')}
                  className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                >
                  Personnalisation
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <a href="tel:+33987124695" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                    09 87 12 46 95
                  </a>
                  <div className="text-xs text-gray-500">Lun-Ven 9h-19h</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <a href="mailto:contact@jsevent.fr" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                  contact@jsevent.fr
                </a>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-gray-400 text-sm">
                  3 rue Georges Queva<br />
                  62218 Loison sous Lens, France
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Liens Rapides</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => scrollToSection('accueil')}
                  className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                >
                  Accueil
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                >
                  Nos Formules
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('temoignages')}
                  className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                >
                  Témoignages
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                >
                  Devis Gratuit
                </button>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                  Galerie Photos
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                  Blog
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <span>© 2025 JSEVENT. Tous droits réservés.</span>
              <span>Fait avec</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>à Paris</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Mentions légales
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Politique de confidentialité
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                CGV
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;