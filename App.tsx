
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DashboardPreview from './components/DashboardPreview';
import Features from './components/Features';
import SmartOptimizer from './components/SmartOptimizer';
import RateCalculator from './components/RateCalculator';
import Footer from './components/Footer';
import LogiBot from './components/LogiBot';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';
import { TrackingModal } from './components/Modals';
import { storageService } from './services/storageService';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'dashboard' | 'auth'>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  // Persistence Hook
  useEffect(() => {
    const user = storageService.getUser();
    if (user.isLoggedIn) {
      setIsLoggedIn(true);
      setView('dashboard');
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setView('dashboard');
  };

  const handleLogout = () => {
    storageService.logout();
    setIsLoggedIn(false);
    setView('landing');
  };

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setView('auth');
  };

  if (view === 'auth') {
    return (
      <AuthPage 
        initialMode={authMode} 
        onBack={() => setView('landing')} 
        onSuccess={handleLoginSuccess} 
      />
    );
  }

  if (view === 'dashboard' && isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <Dashboard onLogout={handleLogout} />
        <LogiBot />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar 
        isLoggedIn={isLoggedIn}
        onOpenAuth={handleOpenAuth} 
        onOpenTracking={() => setIsTrackingOpen(true)}
        onGoToDashboard={() => setView('dashboard')}
      />
      
      <main>
        <Hero 
          onStart={() => isLoggedIn ? setView('dashboard') : handleOpenAuth('signup')} 
          onDemo={() => setIsTrackingOpen(true)}
        />
        
        <div className="bg-slate-900/20 py-12 border-y border-slate-900">
           <div className="container mx-auto px-6">
              <p className="text-center text-slate-500 text-sm font-bold uppercase tracking-[0.3em] mb-8">Empowering India's Top Brands</p>
              <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                {['Flipkart', 'Meesho', 'Myntra', 'Nykaa', 'Snapdeal', 'Ajio'].map((brand) => (
                  <span key={brand} className="text-2xl font-black tracking-tighter text-slate-200 cursor-default">{brand}</span>
                ))}
              </div>
           </div>
        </div>

        <DashboardPreview />
        
        <div id="features">
          <Features />
        </div>

        <RateCalculator />

        <div id="optimizer">
          <SmartOptimizer />
        </div>
        
        <div id="pricing">
          <section className="py-24 bg-slate-950 relative overflow-hidden">
            <div className="absolute inset-0 -z-10">
              <img 
                src="https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80&w=2000" 
                alt="Delivery Plane" 
                className="w-full h-full object-cover opacity-10"
              />
              <div className="absolute inset-0 bg-slate-950/80"></div>
            </div>

            <div className="container mx-auto px-6 text-center">
              <div className="max-w-4xl mx-auto p-12 md:p-20 rounded-[3rem] bg-gradient-to-br from-blue-700/90 via-indigo-700/90 to-purple-800/90 backdrop-blur-md text-white shadow-3xl shadow-blue-500/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
                
                <div className="relative z-10">
                  <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Move More. Grow in India.</h2>
                  <p className="text-xl md:text-2xl text-blue-100 mb-10 leading-relaxed font-medium">
                    Power your business with smart logistics, 25+ Indian courier options, real-time tracking, and automated fulfillment — all in one place.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button onClick={() => isLoggedIn ? setView('dashboard') : handleOpenAuth('signup')} className="bg-white text-blue-700 px-10 py-5 rounded-2xl font-black text-xl hover:bg-blue-50 transition-all transform hover:-translate-y-1 shadow-xl">
                      {isLoggedIn ? 'Open Dashboard' : 'Start Shipping Now'}
                    </button>
                    <button onClick={() => setIsTrackingOpen(true)} className="bg-blue-900/30 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-blue-900/50 transition-all">
                      Track a Package
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="py-24 border-t border-slate-900 bg-slate-900/10">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-12">Ready to ship across India?</h2>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {[
                { icon: "✅", text: "Zero setup fee" },
                { icon: "✅", text: "29,000+ Pincodes" },
                { icon: "✅", text: "GST compliant invoicing" },
                { icon: "✅", text: "Instant COD activation" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-slate-300 font-bold text-lg">
                  <span className="text-blue-500">{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <LogiBot />
      
      <TrackingModal 
        isOpen={isTrackingOpen} 
        onClose={() => setIsTrackingOpen(false)} 
      />
    </div>
  );
};

export default App;
