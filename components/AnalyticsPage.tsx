
import React from 'react';
import { ShipmentStatus } from '../types';

// Fix: Added props interface to receive shipments data from the Dashboard component.
interface AnalyticsPageProps {
  shipments: ShipmentStatus[];
}

const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ shipments }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10">
          <h3 className="text-xl font-bold mb-8">Courier Performance Score</h3>
          <div className="space-y-8">
            {[
              { label: 'Delhivery', value: 94, color: 'bg-blue-500' },
              { label: 'BlueDart', value: 88, color: 'bg-indigo-500' },
              { label: 'XpressBees', value: 82, color: 'bg-emerald-500' },
              { label: 'Ecom Express', value: 76, color: 'bg-purple-500' },
            ].map((c, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-300">{c.label}</span>
                  <span className="text-xs font-black text-slate-500">{c.value}/100</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div className={`${c.color} h-full transition-all duration-1000`} style={{ width: `${c.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10">
          <h3 className="text-xl font-bold mb-8">Daily Order Volume</h3>
          <div className="flex items-end justify-between h-48 space-x-2">
            {[40, 60, 45, 90, 75, 55, 100, 85, 65, 40].map((h, i) => (
              <div key={i} className="flex-1 group relative">
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-slate-950 text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {h * 12}
                 </div>
                 <div className="bg-gradient-to-t from-blue-600/10 to-blue-500/80 rounded-t-lg transition-all hover:scale-x-110 cursor-help" style={{ height: `${h}%` }}></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest px-2">
            <span>Oct 15</span>
            <span>Today</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10">
         <div className="flex justify-between items-center mb-10">
           <h3 className="text-xl font-bold">RTO Analysis by Zone</h3>
           <span className="text-xs text-slate-500 font-bold">Average RTO: 14.2%</span>
         </div>
         <div className="grid md:grid-cols-4 gap-8">
            {[
              { zone: 'Zone A', loc: 'Metros', rto: '4.2%', class: 'text-emerald-400' },
              { zone: 'Zone B', loc: 'Tier 1', rto: '8.5%', class: 'text-blue-400' },
              { zone: 'Zone C', loc: 'Tier 2', rto: '18.1%', class: 'text-orange-400' },
              { zone: 'Zone D', loc: 'Rural/NE', rto: '24.9%', class: 'text-red-400' }
            ].map((z, i) => (
              <div key={i} className="bg-slate-950 p-6 rounded-3xl border border-white/5 text-center">
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{z.zone}</p>
                 <h4 className="text-lg font-bold text-white mb-2">{z.loc}</h4>
                 <div className={`text-2xl font-black ${z.class}`}>{z.rto}</div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
