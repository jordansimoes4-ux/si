import React, { useState } from 'react';
import { Menu, X, Calendar, Phone } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-yellow-600/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-yellow-400">
              JS<span className="text-yellow-300">EVENT</span>
            </div>
            <div className="ml-2 text-xs text-gray-300 italic hidden sm:block">
              Vos événements, notre signature
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('accueil')}
              className="text-white hover:text-yellow-400 transition-colors duration-300"
            >
              Accueil
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="text-white hover:text-yellow-400 transition-colors duration-300"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('photobooth')}
              className="text-white hover:text-yellow-400 transition-colors duration-300"
            >
              Photobooth
            </button>
            <button 
              onClick={() => scrollToSection('temoignages')}
              className="text-white hover:text-yellow-400 transition-colors duration-300"
            >
              Témoignages
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-white hover:text-yellow-400 transition-colors duration-300"
            >
              Contact
            </button>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => scrollToSection('contact')}
              className="flex items-center space-x-2 px-4 py-2 border border-yellow-600 text-yellow-400 rounded-full hover:bg-yellow-600 hover:text-black transition-all duration-300"
            >
              <Calendar className="w-4 h-4" />
              <span>Rendez-vous</span>
            </button>
            <a 
              href="tel:+33987124695"
              className="flex items-center space-x-2 px-6 py-2 bg-yellow-600 text-black rounded-full hover:bg-yellow-500 transition-all duration-300 font-semibold"
            >
              <Phone className="w-4 h-4" />
              <span>Appeler</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-b border-yellow-600/20">
            <div className="px-4 py-6 space-y-4">
              <button 
                onClick={() => scrollToSection('accueil')}
                className="block w-full text-left text-white hover:text-yellow-400 transition-colors duration-300 py-2"
              >
                Accueil
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="block w-full text-left text-white hover:text-yellow-400 transition-colors duration-300 py-2"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('photobooth')}
                className="block w-full text-left text-white hover:text-yellow-400 transition-colors duration-300 py-2"
              >
                Photobooth
              </button>
              <button 
                onClick={() => scrollToSection('temoignages')}
                className="block w-full text-left text-white hover:text-yellow-400 transition-colors duration-300 py-2"
              >
                Témoignages
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left text-white hover:text-yellow-400 transition-colors duration-300 py-2"
              >
                Contact
              </button>
              <div className="flex flex-col space-y-3 pt-4 border-t border-yellow-600/20">
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="flex items-center justify-center space-x-2 px-4 py-2 border border-yellow-600 text-yellow-400 rounded-full hover:bg-yellow-600 hover:text-black transition-all duration-300"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Rendez-vous</span>
                </button>
                <a 
                  href="tel:+33123456789"
                  className="flex items-center justify-center space-x-2 px-6 py-2 bg-yellow-600 text-black rounded-full hover:bg-yellow-500 transition-all duration-300 font-semibold"
                >
                  <Phone className="w-4 h-4" />
                  <span>Appeler</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;