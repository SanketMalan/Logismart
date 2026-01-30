
import React from 'react';
import { Pickup } from '../types';

const scheduled: Pickup[] = [
  { id: 'PKP-102', courier: 'Delhivery', status: 'Scheduled', address: 'Bhiwandi Warehouse, Sec-4', slots: '10 AM - 1 PM', count: 42 },
  { id: 'PKP-103', courier: 'BlueDart', status: 'Completed', address: 'Bhiwandi Warehouse, Sec-4', slots: '2 PM - 5 PM', count: 12 },
  { id: 'PKP-104', courier: 'XpressBees', status: 'Delayed', address: 'Bangalore Sorting Hub', slots: '9 AM - 11 AM', count: 8 },
];

const PickupsPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem]">
        <div>
          <h2 className="text-2xl font-black mb-1">Pickups Management</h2>
          <p className="text-slate-500 text-sm">Monitor your daily courier visit cycles and manifest handovers.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/30 active:scale-95">
          Schedule New Pickup
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scheduled.map((p, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 hover:border-blue-500/30 transition-all">
             <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-3">
                   <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center font-bold text-blue-400">📦</div>
                   <div>
                      <h4 className="font-bold text-slate-200">{p.courier}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">{p.id}</p>
                   </div>
                </div>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full ${
                   p.status === 'Completed' ? 'bg-green-500/10 text-green-400' : 
                   p.status === 'Scheduled' ? 'bg-blue-500/10 text-blue-400' : 
                   'bg-red-500/10 text-red-400'
                }`}>{p.status.toUpperCase()}</span>
             </div>
             
             <div className="space-y-4">
                <div className="flex justify-between text-xs">
                   <span className="text-slate-500">Pickup Slot</span>
                   <span className="font-bold text-slate-300">{p.slots}</span>
                </div>
                <div className="flex justify-between text-xs">
                   <span className="text-slate-500">Shipments</span>
                   <span className="font-bold text-slate-300">{p.count} Orders</span>
                </div>
                <div className="pt-4 border-t border-white/5">
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Address</p>
                   <p className="text-xs text-slate-400 leading-relaxed truncate">{p.address}</p>
                </div>
             </div>
             
             <button className="w-full mt-6 bg-slate-800 hover:bg-slate-700 py-3 rounded-xl text-xs font-bold transition-all">Download Manifest</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PickupsPage;
