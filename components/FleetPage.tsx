
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { Vehicle, Driver } from '../types';

const FleetPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(storageService.getVehicles());
  const [drivers, setDrivers] = useState<Driver[]>(storageService.getDrivers());

  useEffect(() => {
    setVehicles(storageService.getVehicles());
    setDrivers(storageService.getDrivers());
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-white">Active Fleet & Personnel</h2>
          <p className="text-slate-500 font-medium">Manage last-mile delivery assets and driver scheduling.</p>
        </div>
        <div className="flex gap-4">
           <button className="bg-slate-900 border border-slate-800 px-6 py-3 rounded-2xl font-black text-sm hover:bg-slate-800 transition-colors">Route Mapping</button>
           <button className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-xl shadow-blue-600/20 active:scale-95">+ Onboard Asset</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-lg">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-3 text-white">
             <span className="text-2xl">🚛</span> Operational Fleet
          </h3>
          <div className="space-y-4">
            {vehicles.map(v => (
              <div key={v.id} className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 flex items-center justify-between group hover:border-blue-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-white/5 shadow-inner">
                    <span className="text-[10px] font-black text-slate-500 uppercase">{v.type.split(' ')[0]}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{v.numberPlate}</h4>
                    <p className="text-[10px] text-slate-500 uppercase font-black">{v.capacity} KG Payload</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[9px] font-black px-3 py-1 rounded-full border ${
                    v.status === 'Available' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5' : 'text-blue-400 border-blue-400/20 bg-blue-400/5'
                  }`}>{v.status.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-lg">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-3 text-white">
             <span className="text-2xl">👷</span> Driver Roster
          </h3>
          <div className="space-y-4">
            {drivers.map(d => (
              <div key={d.id} className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 flex items-center justify-between group hover:border-blue-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-400 font-bold border border-blue-500/20">
                    {d.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{d.name}</h4>
                    <p className="text-[10px] text-slate-500 uppercase font-black">ID: {d.id} • {d.phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[9px] font-black px-3 py-1 rounded-full border ${
                    d.status === 'Active' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5' : 'text-blue-400 border-blue-400/20 bg-blue-400/5'
                  }`}>{d.status.toUpperCase()}</span>
                  <div className="text-[10px] text-slate-600 mt-2 font-bold uppercase tracking-tight">{d.assignedVehicleId || 'Standby Mode'}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default FleetPage;
