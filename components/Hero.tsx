
import React, { useState } from 'react';

interface HeroProps {
  onStart: () => void;
  onDemo: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart, onDemo }) => {
  const [pincode, setPincode] = useState('');
  const [serviceable, setServiceable] = useState<boolean | null>(null);

  const checkPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setServiceable(true);
      setTimeout(() => setServiceable(null), 3000);
    }
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden min-h-[90vh] flex items-center">
      {/* Dynamic Background Image & Overlays */}
      <div className="absolute inset-0 -z-20">
        <img 
          src="https://images.unsplash.com/photo-1570126618983-22442c7110ca?auto=format&fit=crop&q=80&w=2000" 
          alt="Indian Logistics Background" 
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950"></div>
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[60%] bg-blue-600/20 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[50%] bg-orange-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 text-center max-w-5xl relative z-10">
        <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-full px-4 py-1.5 mb-10 transform hover:scale-105 transition-transform cursor-default">
          <span className="flex h-2 w-2 rounded-full bg-orange-400 animate-pulse"></span>
          <span className="text-[10px] font-bold text-blue-300 tracking-[0.2em] uppercase">India's #1 Shipping Solution</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] mb-8 tracking-tighter">
          All-in-One <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Logistics Platform</span> <br />
          <span className="text-slate-100">for Pan-India Growth</span>
        </h1>
        
        <h2 className="text-xl md:text-2xl text-slate-200 mb-6 font-semibold max-w-4xl mx-auto leading-snug">
          Ship orders seamlessly across 29,000+ pincodes. Choose from 25+ Indian courier partners, manage COD, and scale your brand effortlessly.
        </h2>

        {/* Pincode Checker Widget */}
        <div className="max-w-md mx-auto mb-10 relative">
          <form onSubmit={checkPincode} className="flex bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-2 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
            <input 
              type="text" 
              maxLength={6}
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
              placeholder="Check Pincode Serviceability (e.g. 110001)"
              className="bg-transparent flex-1 px-4 py-3 text-sm focus:outline-none"
            />
            <button className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap">
              Check
            </button>
          </form>
          {serviceable && (
            <div className="absolute top-full left-0 right-0 mt-2 text-green-400 text-xs font-bold animate-in fade-in slide-in-from-top-1">
              ✓ Serviceable: {pincode} (24h Express Pickup Available)
            </div>
          )}
        </div>
        
        <p className="text-lg text-slate-400 mb-12 leading-relaxed max-w-3xl mx-auto">
          Built for Indian eCommerce. From local deliveries to national fulfillment, handle everything from one powerful dashboard while reducing RTO and shipping costs.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-20">
          <button onClick={onStart} className="group relative w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all shadow-[0_0_40px_rgba(37,99,235,0.3)]">
            <span className="relative z-10">Start Shipping in India</span>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
          <button onClick={onDemo} className="w-full sm:w-auto bg-slate-900/50 hover:bg-slate-800 text-white px-10 py-5 rounded-2xl font-bold text-xl border border-slate-800 transition-all backdrop-blur-sm">
            Book a Free Demo
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-white/5 opacity-40">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white">25+</span>
            <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Courier Partners</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white">29,000+</span>
            <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Indian Pincodes</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white">₹0</span>
            <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Setup Cost</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white">24hr</span>
            <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold">COD Payouts</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
