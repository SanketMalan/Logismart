
import React, { useState } from 'react';
import { getSmartLogisticAdvice } from '../services/geminiService';
import { OptimizedRoute } from '../types';

const SmartOptimizer: React.FC = () => {
  const [origin, setOrigin] = useState('Mumbai');
  const [destination, setDestination] = useState('Bangalore');
  const [cargo, setCargo] = useState('Apparel & Fashion');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<OptimizedRoute[]>([]);

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const advice = await getSmartLogisticAdvice(origin, destination, cargo);
      setResults(advice);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-32 bg-slate-950">
      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden group">
          {/* Subtle Background Logistics Image */}
          <div className="absolute inset-0 -z-10 opacity-5 group-hover:opacity-15 transition-opacity duration-1000">
            <img 
              src="https://images.unsplash.com/photo-1605152276897-4f618f831968?auto=format&fit=crop&q=80&w=2000" 
              alt="Warehouse Background" 
              className="w-full h-full object-cover grayscale"
            />
          </div>
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm -z-10"></div>
          
          <div className="flex flex-col lg:flex-row gap-20 items-stretch relative z-10">
            <div className="lg:w-2/5 flex flex-col justify-center">
              <div className="bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-md w-fit mb-6">
                Proprietary AI Logic
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Optimizing Pan-India <br />Delivery Routes</h2>
              <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                Connect your business to our Gemini-powered engine. We analyze 25+ Indian couriers to find the fastest and cheapest route for your shipment.
              </p>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Pickup City</label>
                    <input 
                      type="text" 
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all placeholder-slate-600"
                      placeholder="e.g. Mumbai"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Delivery City</label>
                    <input 
                      type="text" 
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all placeholder-slate-600"
                      placeholder="e.g. Hyderabad"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Product Category</label>
                  <select 
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl px-5 py-4 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all cursor-pointer"
                  >
                    <option>Apparel & Fashion</option>
                    <option>Electronics & Mobiles</option>
                    <option>Health & Personal Care</option>
                    <option>Home & Kitchen</option>
                    <option>Groceries (Perishables)</option>
                  </select>
                </div>
                <button 
                  onClick={handleOptimize}
                  disabled={loading}
                  className="w-full bg-white text-slate-950 py-5 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-950" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Checking Carrier SLA...
                    </span>
                  ) : 'Calculate Best Indian Route'}
                </button>
              </div>
            </div>

            <div className="lg:w-3/5 min-h-[500px] flex flex-col">
              {results.length > 0 ? (
                <div className="grid gap-6 h-full content-center">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">Recommended Indian Couriers</h3>
                    <button onClick={() => setResults([])} className="text-slate-500 text-sm hover:text-white">Clear</button>
                  </div>
                  {results.map((r, i) => (
                    <div key={i} className="group bg-slate-900/60 backdrop-blur-md hover:bg-slate-800/80 border border-slate-800 rounded-3xl p-8 transition-all hover:translate-x-2">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-3">
                            <span className="text-xl font-black text-blue-400">{r.carrier}</span>
                            <div className="h-4 w-[1px] bg-slate-700"></div>
                            <span className="text-sm font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded">
                              Efficiency: {r.efficiencyScore}/100
                            </span>
                          </div>
                          <p className="text-slate-400 text-sm leading-relaxed">{r.reasoning}</p>
                        </div>
                        <div className="text-right flex flex-col justify-center">
                          <div className="text-2xl font-black text-white">{r.cost}</div>
                          <div className="text-xs uppercase tracking-tighter text-slate-500 font-bold">Delivery in {r.estimatedDelivery}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center p-12 text-center bg-slate-900/20 backdrop-blur-[2px]">
                  <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center mb-6">
                    <span className="text-4xl">🚚</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-slate-300">Ready to Ship?</h3>
                  <p className="text-slate-500 max-w-xs">Enter your pickup and delivery cities to compare India's top couriers instantly.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SmartOptimizer;
