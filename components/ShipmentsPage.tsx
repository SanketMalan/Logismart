
import React, { useState } from 'react';
import { ShipmentStatus } from '../types';

interface ShipmentsPageProps {
  shipments: ShipmentStatus[];
  onViewInvoice: (s: ShipmentStatus) => void;
}

const ShipmentsPage: React.FC<ShipmentsPageProps> = ({ shipments, onViewInvoice }) => {
  const [filter, setFilter] = useState('All');

  const filtered = shipments.filter(s => filter === 'All' || s.currentStatus === filter);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          {['All', 'In Transit', 'Delivered', 'Pickup Pending'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === f ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-4">
           <button className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors">Generate Report</button>
           <button className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors">Bulk Actions</button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-slate-950/50">
            <tr className="text-slate-500 text-[10px] uppercase tracking-[0.2em] border-b border-slate-800">
              <th className="px-10 py-6 font-black">Shipment ID</th>
              <th className="py-6 font-black">Route Information</th>
              <th className="py-6 font-black text-center">Status</th>
              <th className="px-10 py-6 font-black text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filtered.map((s, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                <td className="px-10 py-6">
                   <div className="font-mono text-sm font-bold text-blue-400">{s.id}</div>
                   <div className="text-[10px] text-slate-600 mt-1 font-black uppercase tracking-widest">Forward Logistic</div>
                </td>
                <td className="py-6">
                  <div className="text-sm font-bold text-white">{s.origin} <span className="text-slate-600 mx-2">→</span> {s.destination}</div>
                </td>
                <td className="py-6 text-center">
                  <span className={`text-[10px] font-black px-4 py-1.5 rounded-full border ${
                    s.currentStatus === 'Delivered' ? 'text-emerald-400 bg-emerald-400/5 border-emerald-400/20' : 
                    s.currentStatus === 'In Transit' ? 'text-blue-400 bg-blue-400/5 border-blue-400/20' : 
                    'text-orange-400 bg-orange-400/5 border-orange-400/20'
                  }`}>
                    {s.currentStatus.toUpperCase()}
                  </span>
                </td>
                <td className="px-10 py-6 text-right">
                   <button 
                     onClick={() => onViewInvoice(s)}
                     className="bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                   >
                     Invoice
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-32 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">No Records Found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShipmentsPage;
