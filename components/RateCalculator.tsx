
import React, { useState } from 'react';
import { calculateShippingRates } from '../services/geminiService';
import { shipmentService } from '../services/shipmentService';

const RateCalculator: React.FC = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [weight, setWeight] = useState('0.5');
  const [loading, setLoading] = useState(false);
  const [rates, setRates] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (origin.length !== 6 || destination.length !== 6) return;
    setLoading(true);
    setSearched(true);
    try {
      // Simulate network delay for realism
      await new Promise(resolve => setTimeout(resolve, 800));
      const results = await calculateShippingRates(origin, destination, parseFloat(weight));
      setRates(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (rate: any) => {
    const newId = shipmentService.createShipment(origin, destination, parseFloat(weight), rate.carrier, rate.estimatedCost);
    alert(`Booking Confirmed!\n\nTracking ID: ${newId}\n\nCopy this ID and use the 'Track a Package' feature to see it move in real-time!`);
  };

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[300px] -left-[300px] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] -right-[300px] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Shipping Rate Calculator</h2>
            <p className="text-slate-400 font-medium text-lg max-w-2xl mx-auto">
              Get instant quotes from India's top logistics partners. Compare speeds and prices to find the perfect fit for your shipment.
            </p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <form onSubmit={handleCalculate} className="grid md:grid-cols-12 gap-6 relative z-10 items-end">
              <div className="md:col-span-3 space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Origin Pincode</label>
                <div className="relative group/input">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-blue-500 transition-colors">📍</span>
                  <input 
                    type="text" 
                    maxLength={6}
                    value={origin}
                    onChange={e => setOrigin(e.target.value.replace(/\D/g, ''))}
                    placeholder="From Pincode"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-5 focus:border-blue-500 focus:outline-none transition-all font-mono text-sm group-hover/input:border-slate-700 text-white placeholder:text-slate-700"
                  />
                </div>
              </div>
              
              <div className="md:col-span-3 space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Destination Pincode</label>
                <div className="relative group/input">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-blue-500 transition-colors">🏁</span>
                  <input 
                    type="text" 
                    maxLength={6}
                    value={destination}
                    onChange={e => setDestination(e.target.value.replace(/\D/g, ''))}
                    placeholder="To Pincode"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-5 focus:border-blue-500 focus:outline-none transition-all font-mono text-sm group-hover/input:border-slate-700 text-white placeholder:text-slate-700"
                  />
                </div>
              </div>
              
              <div className="md:col-span-3 space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Weight (KG)</label>
                <div className="relative group/input">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-blue-500 transition-colors">⚖️</span>
                  <input 
                    type="number" 
                    step="0.1"
                    min="0.1"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-5 focus:border-blue-500 focus:outline-none transition-all font-bold text-sm group-hover/input:border-slate-700 text-white"
                  />
                </div>
              </div>
              
              <div className="md:col-span-3">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black text-sm shadow-xl shadow-blue-600/20 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Proccessing...</span>
                    </>
                  ) : (
                    <>
                      <span>Check Rates</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {searched && (
               <div className="mt-12 pt-12 border-t border-white/5">
                 {loading ? (
                    <div className="grid md:grid-cols-3 gap-6 animate-pulse">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="bg-slate-950/50 rounded-3xl h-64 border border-white/5"></div>
                      ))}
                    </div>
                 ) : rates.length > 0 ? (
                  <div className="grid md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 duration-500 fade-in">
                    {rates.map((rate, i) => (
                      <div key={i} className="bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/30 rounded-3xl p-8 transition-all group/card relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-0 group-hover/card:opacity-10 transition-opacity">
                           <span className="text-8xl">₹</span>
                        </div>
                        
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-6">
                            <div>
                              <h4 className="font-black text-white text-lg tracking-tight">{rate.serviceName}</h4>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{rate.carrier}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                               rate.deliveryDays === '1 Day' ? 'bg-amber-400/10 text-amber-400' : 
                               rate.deliveryDays.includes('2-3') ? 'bg-blue-400/10 text-blue-400' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {rate.deliveryDays}
                            </div>
                          </div>
                          
                          <div className="flex items-baseline mb-8">
                             <span className="text-4xl font-black text-white">₹{rate.estimatedCost}</span>
                             <span className="text-slate-500 text-sm ml-2 font-medium">approx.</span>
                          </div>
                          
                          <ul className="space-y-3 mb-8">
                            {rate.features.map((f: string, fi: number) => (
                              <li key={fi} className="flex items-center space-x-3 text-xs text-slate-400 font-medium">
                                <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                  <span className="text-emerald-500 text-[10px]">✓</span>
                                </div>
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                          
                          <button 
                            onClick={() => handleBook(rate)}
                            className="w-full py-3 bg-slate-900 border border-slate-800 hover:bg-blue-600 hover:border-blue-600 text-slate-400 hover:text-white rounded-xl font-bold text-xs transition-all uppercase tracking-wider"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                 ) : (
                   <div className="text-center py-12">
                     <p className="text-slate-500">No rates found for this route. Try changing pincodes.</p>
                   </div>
                 )}
               </div>
            )}
          </div>
          
          <div className="flex justify-center mt-12 space-x-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
             {['Delhivery', 'BlueDart', 'EcomExpress', 'XpressBees', 'DTDC'].map(partner => (
               <span key={partner} className="text-lg font-black text-slate-300">{partner}</span>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RateCalculator;
