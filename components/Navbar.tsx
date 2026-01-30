
import React, { useState, useEffect } from 'react';

interface NavbarProps {
  isLoggedIn: boolean;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenTracking: () => void;
  onGoToDashboard: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, onOpenAuth, onOpenTracking, onGoToDashboard }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/80 backdrop-blur-md py-4 border-b border-slate-800' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">L</div>
          <span className="text-xl font-bold tracking-tight">Logi<span className="text-blue-500">Smart</span></span>
        </button>
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
          <button onClick={() => scrollTo('features')} className="hover:text-white transition-colors">Solutions</button>
          <button onClick={onOpenTracking} className="hover:text-white transition-colors">Tracking</button>
          <button onClick={() => scrollTo('pricing')} className="hover:text-white transition-colors">Pricing</button>
          <button onClick={() => scrollTo('optimizer')} className="hover:text-white transition-colors">Enterprise</button>
        </div>

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <button onClick={onGoToDashboard} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-lg shadow-blue-500/20">
              Go to Dashboard
            </button>
          ) : (
            <>
              <button onClick={() => onOpenAuth('login')} className="hidden sm:block text-sm font-medium hover:text-blue-400 transition-colors">Log In</button>
              <button onClick={() => onOpenAuth('signup')} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-lg shadow-blue-500/20">
                Get Started
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
