
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { Warehouse, ShipmentStatus } from '../types';

const WarehousePage: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>(storageService.getWarehouses());
  const [shipments] = useState<ShipmentStatus[]>(storageService.getShipments());

  useEffect(() => {
    // Dynamically calculate 'occupied' based on shipments currently in each warehouse
    const updatedWarehouses = warehouses.map(wh => {
      const inWhCount = shipments.filter(s => s.currentStatus !== 'Delivered' && s.origin === wh.name).length;
      return { ...wh, occupied: inWhCount * 50 }; // Assume 50 units space per shipment
    });
    setWarehouses(updatedWarehouses);
    storageService.saveInfrastructure(updatedWarehouses, storageService.getVehicles(), storageService.getDrivers());
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-white">Warehouse Network</h2>
          <p className="text-slate-500 font-medium">Real-time hub health and storage utilization.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-xl shadow-blue-600/20 active:scale-95">
          + Open New Hub
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {warehouses.map((wh) => {
          const occupancyRate = (wh.occupied / wh.capacity) * 100;
          return (
            <div key={wh.id} className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 hover:border-blue-500/30 transition-all group overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-inner">🏢</div>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${
                  wh.status === 'Active' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' : 'bg-red-500/5 text-red-400 border-red-500/20'
                }`}>{wh.status.toUpperCase()}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{wh.name}</h3>
              <p className="text-xs text-slate-500 mb-6">{wh.location}</p>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                    <span>Capacity Used</span>
                    <span className={occupancyRate > 90 ? 'text-red-400' : 'text-emerald-400'}>{occupancyRate.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${occupancyRate > 90 ? 'bg-red-500' : 'bg-blue-500'}`} 
                      style={{ width: `${Math.max(occupancyRate, 2)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs border-t border-white/5 pt-4">
                  <span className="text-slate-500">Maximum Capacity</span>
                  <span className="font-bold text-slate-300">{wh.capacity.toLocaleString()} Volumetric Units</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Available Inventory Space</span>
                  <span className="font-bold text-emerald-400">{(wh.capacity - wh.occupied).toLocaleString()} Units</span>
                </div>
              </div>
              <button className="w-full mt-8 bg-slate-800 hover:bg-slate-700 py-3 rounded-xl text-xs font-black transition-all">Hub Inventory Logs</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WarehousePage;
