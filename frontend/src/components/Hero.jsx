import React from 'react';
import { Sparkles, Calendar, ArrowRight } from 'lucide-react';

const Hero = () => {
  const scrollToServices = () => {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="accueil" className="min-h-screen bg-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse"></div>
        <div className="absolute top-60 left-1/3 w-1 h-1 bg-green-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-60 right-1/3 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-12">
            {/* Logo and Brand */}
            <div className="space-y-8">
              {/* Main Logo */}
              <div className="relative">
                <div className="text-8xl md:text-9xl lg:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 via-yellow-500 to-yellow-600 drop-shadow-2xl">
                  JS
                </div>
                
                {/* Sparkle effects around logo */}
                <Sparkles className="absolute -top-4 -left-4 w-8 h-8 text-yellow-400 animate-pulse" />
                <Sparkles className="absolute -top-2 -right-6 w-6 h-6 text-blue-400 animate-ping" />
                <Sparkles className="absolute -bottom-4 left-2 w-7 h-7 text-pink-400 animate-pulse" />
                <Sparkles className="absolute -bottom-2 -right-4 w-5 h-5 text-green-400 animate-ping" />
                
                {/* Decorative elements */}
                <div className="absolute top-1/2 -left-20 w-4 h-1 bg-yellow-400 rounded transform -translate-y-1/2 rotate-45"></div>
                <div className="absolute top-1/3 -right-16 w-3 h-1 bg-blue-400 rounded transform rotate-12"></div>
                <div className="absolute bottom-1/3 -left-16 w-5 h-1 bg-pink-400 rounded transform -rotate-12"></div>
                <div className="absolute bottom-1/2 -right-20 w-3 h-1 bg-red-400 rounded transform translate-y-1/2 -rotate-45"></div>
              </div>

              {/* Brand name */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-wider">
                  EVENT
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 italic font-light">
                  Vos événements, notre signature
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="max-w-3xl mx-auto space-y-6">
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
                Transformez vos moments les plus précieux en souvenirs inoubliables. 
                <br className="hidden md:block" />
                Mariage, anniversaire, baptême - nous donnons vie à vos rêves.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base text-gray-300">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Animation professionnelle</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Éclairage haut de gamme</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  <span>Service personnalisé</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
              <button 
                onClick={scrollToServices}
                className="group flex items-center space-x-3 px-8 py-4 bg-yellow-600 text-black rounded-full hover:bg-yellow-500 transition-all duration-300 font-semibold text-lg shadow-2xl hover:shadow-yellow-600/25"
              >
                <span>Découvrir nos services</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              
              <button 
                onClick={scrollToContact}
                className="flex items-center space-x-3 px-8 py-4 border-2 border-yellow-600 text-yellow-400 rounded-full hover:bg-yellow-600 hover:text-black transition-all duration-300 font-semibold text-lg"
              >
                <Calendar className="w-5 h-5" />
                <span>Prendre rendez-vous</span>
              </button>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="w-1 h-12 bg-gradient-to-b from-yellow-400 to-transparent rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;