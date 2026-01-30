
import React, { useState } from 'react';
import { trackShipment } from '../services/geminiService';
import { storageService } from '../services/storageService';
import { shipmentService } from '../services/shipmentService';
import { ShipmentStatus } from '../types';

export const NewShipmentModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void }> = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryAddress: '',
    deliveryPincode: '',
    weight: '0.5',
    length: '10',
    width: '10',
    height: '10',
    contentDesc: '',
    invoiceValue: '',
    paymentMode: 'Prepaid', 
    serviceType: 'Standard'
  });

  if (!isOpen) return null;

  const handleNext = () => setStep(s => Math.min(s + 1, 3));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    setStep(1);
    setFormData({
      customerName: '', customerPhone: '', customerEmail: '', deliveryAddress: '', deliveryPincode: '',
      weight: '0.5', length: '10', width: '10', height: '10', contentDesc: '', invoiceValue: '',
      paymentMode: 'Prepaid', serviceType: 'Standard'
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-white/5 rounded-[3rem] w-full max-w-4xl relative shadow-[0_0_100px_rgba(37,99,235,0.1)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-10 py-8 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
          <div>
            <h2 className="text-3xl font-black text-white">Shipment Manifest</h2>
            <div className="flex items-center space-x-2 mt-2">
              {[1, 2, 3].map(s => (
                <div key={s} className={`h-1.5 w-12 rounded-full transition-all duration-500 ${step >= s ? 'bg-blue-600' : 'bg-slate-800'}`}></div>
              ))}
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Step {step} of 3</span>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl transition-all">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          {step === 1 && (
            <div className="space-y-10 animate-in slide-in-from-right-10 duration-500">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 text-xl">👤</div>
                <div>
                  <h3 className="text-xl font-bold text-white">Consignee Details</h3>
                  <p className="text-xs text-slate-500 font-medium">Recipient's contact and delivery destination info.</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
                  <input required value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 focus:border-blue-500 focus:outline-none transition-all font-bold" placeholder="e.g. Rajesh Kumar" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Mobile Number</label>
                  <input required type="tel" maxLength={10} value={formData.customerPhone} onChange={e => setFormData({...formData, customerPhone: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 focus:border-blue-500 focus:outline-none transition-all font-mono" placeholder="98XXXXXXXX" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Full Delivery Address</label>
                  <textarea required value={formData.deliveryAddress} onChange={e => setFormData({...formData, deliveryAddress: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 focus:border-blue-500 focus:outline-none transition-all h-24 resize-none" placeholder="Flat No, Building Name, Street, Landmark..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Destination Pincode</label>
                  <input required maxLength={6} value={formData.deliveryPincode} onChange={e => setFormData({...formData, deliveryPincode: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 focus:border-blue-500 focus:outline-none transition-all font-mono" placeholder="400001" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email (Optional)</label>
                  <input type="email" value={formData.customerEmail} onChange={e => setFormData({...formData, customerEmail: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 focus:border-blue-500 focus:outline-none transition-all" placeholder="name@example.com" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-10 animate-in slide-in-from-right-10 duration-500">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 text-xl">📦</div>
                <div>
                  <h3 className="text-xl font-bold text-white">Package Dimensions</h3>
                  <p className="text-xs text-slate-500 font-medium">Volumetric and dead weight specifics.</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-4 gap-8">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Dead Weight (KG)</label>
                  <input required type="number" step="0.1" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 focus:border-blue-500 focus:outline-none transition-all font-bold" />
                </div>
                <div className="md:col-span-2 space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Product Description</label>
                   <input required value={formData.contentDesc} onChange={e => setFormData({...formData, contentDesc: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 focus:border-blue-500 focus:outline-none transition-all" placeholder="e.g. Cotton T-Shirts (Set of 3)" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Length (cm)</label>
                  <input required type="number" value={formData.length} onChange={e => setFormData({...formData, length: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 focus:border-blue-500 focus:outline-none transition-all font-mono" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Width (cm)</label>
                  <input required type="number" value={formData.width} onChange={e => setFormData({...formData, width: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 focus:border-blue-500 focus:outline-none transition-all font-mono" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Height (cm)</label>
                  <input required type="number" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 focus:border-blue-500 focus:outline-none transition-all font-mono" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Invoice Value (₹)</label>
                  <input required type="number" value={formData.invoiceValue} onChange={e => setFormData({...formData, invoiceValue: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 focus:border-blue-500 focus:outline-none transition-all font-bold" placeholder="999" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-10 animate-in slide-in-from-right-10 duration-500">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 text-xl">⚡</div>
                <div>
                  <h3 className="text-xl font-bold text-white">Shipping Preferences</h3>
                  <p className="text-xs text-slate-500 font-medium">Payment collection and service speed.</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Payment Mode</label>
                  <div className="grid grid-cols-2 gap-4">
                    {['Prepaid', 'COD'].map(mode => (
                      <button 
                        key={mode} 
                        type="button"
                        onClick={() => setFormData({...formData, paymentMode: mode})}
                        className={`py-4 rounded-2xl border transition-all font-black text-sm ${formData.paymentMode === mode ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Service Level</label>
                  <div className="grid grid-cols-2 gap-4">
                    {['Standard', 'Express'].map(speed => (
                      <button 
                        key={speed} 
                        type="button"
                        onClick={() => setFormData({...formData, serviceType: speed})}
                        className={`py-4 rounded-2xl border transition-all font-black text-sm ${formData.serviceType === speed ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
                      >
                        {speed}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 bg-blue-600/5 border border-blue-500/10 p-8 rounded-[2.5rem]">
                   <h4 className="text-sm font-black text-blue-400 mb-4 uppercase tracking-widest">Summary</h4>
                   <div className="flex justify-between items-center text-slate-400 text-sm">
                      <span>Delivery to: <span className="text-white font-bold">{formData.deliveryPincode}</span></span>
                      <span>Total weight: <span className="text-white font-bold">{formData.weight} kg</span></span>
                      <span>Payment: <span className="text-white font-bold uppercase">{formData.paymentMode}</span></span>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-10 py-8 border-t border-white/5 bg-slate-900/50 flex justify-between items-center">
          {step > 1 ? (
            <button onClick={handleBack} className="px-10 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-black text-sm transition-all">Back</button>
          ) : <div></div>}
          
          {step < 3 ? (
            <button onClick={handleNext} className="px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-600/20 active:scale-95 transition-all">Continue</button>
          ) : (
            <button onClick={handleSubmit} className="px-16 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black text-sm shadow-2xl active:scale-95 transition-all">Finalize Order Manifest</button>
          )}
        </div>
      </div>
    </div>
  );
};

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Fix for Leaflet marker icons in React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const TrackingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<ShipmentStatus | null>(null);

  if (!isOpen) return null;

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const result = shipmentService.getShipment(id);
      
      if (result) {
        setStatus(result);
      } else {
        // Fallback or error handling
         alert("Tracking ID not found. Try booking a shipment first!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-0 w-full max-w-5xl relative max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-all backdrop-blur-md">✕</button>
        
        {/* Left Side - Search & Status */}
        <div className="w-full md:w-1/3 p-8 md:p-12 overflow-y-auto custom-scrollbar border-r border-white/5 bg-slate-900 z-10">
          <h2 className="text-3xl font-black mb-8 tracking-tight">Track Shipment</h2>
          
          <form onSubmit={handleTrack} className="flex flex-col gap-4 mb-10">
            <input 
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Enter Tracking ID" 
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 font-mono text-sm" 
            />
            <button disabled={loading} className="bg-blue-600 hover:bg-blue-500 w-full py-4 rounded-2xl font-black text-sm transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-blue-600/20">
              {loading ? 'Locating...' : 'Track Now'}
            </button>
          </form>

          {status ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8">
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Status</p>
                <p className="text-2xl font-black text-white">{status.currentStatus}</p>
                <p className="text-sm text-blue-400 font-medium">Est. Delivery: {status.estimatedArrival}</p>
              </div>

              <div className="space-y-6 relative">
                 <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-800"></div>
                 {status.history.slice(0, 3).map((step, idx) => (
                   <div key={idx} className="relative pl-8">
                     <div className={`absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${idx === 0 ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-slate-700'}`}></div>
                     <div>
                       <h4 className={`text-sm font-bold ${idx === 0 ? 'text-white' : 'text-slate-400'}`}>{step.status}</h4>
                       <p className="text-xs text-slate-500 mt-1">{step.location}</p>
                     </div>
                   </div>
                 ))}
                 {status.history.length > 3 && (
                   <div className="pl-8 text-xs text-slate-500 italic">
                     + {status.history.length - 3} more updates...
                   </div>
                 )}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 opacity-50">
              <div className="text-4xl mb-4">🌏</div>
              <p className="text-sm text-slate-400">Enter a tracking ID to see real-time location and status updates.</p> 
            </div>
          )}
        </div>

        {/* Right Side - Map */}
        <div className="w-full md:w-2/3 bg-slate-800 relative min-h-[400px]">
          {status && status.originCoords ? (
             <MapContainer 
               center={status.currentCoords} 
               zoom={5} 
               scrollWheelZoom={false} 
               style={{ height: '100%', width: '100%', background: '#020617' }}
             >
               <TileLayer
                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                 url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
               />
               <Marker position={status.originCoords}>
                 <Popup>Origin: {status.origin}</Popup>
               </Marker>
               <Marker position={status.destCoords}>
                  <Popup>Destination: {status.destination}</Popup>
               </Marker>
               <Marker position={status.currentCoords}>
                 <Popup>Current Location: {status.currentStatus}</Popup>
               </Marker>
               <Polyline 
                 positions={[status.originCoords, status.currentCoords, status.destCoords]} 
                 color="#2563eb"
                 weight={4}
                 opacity={0.6}
                 dashArray="10, 10"
               />
               <Polyline 
                 positions={[status.originCoords, status.currentCoords]} 
                 color="#3b82f6"
                 weight={4}
               />
             </MapContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-slate-950 relative overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950"></div>
               <div className="bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-10 absolute inset-0 mix-blend-overlay"></div>
               <p className="text-slate-600 font-medium relative z-10">Map View Available After Tracking</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

