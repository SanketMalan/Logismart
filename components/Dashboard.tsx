
import React, { useState, useEffect } from 'react';
import KycPage from './KycPage';
import ShipmentsPage from './ShipmentsPage';
import AnalyticsPage from './AnalyticsPage';
import PickupsPage from './PickupsPage';
import WalletPage from './WalletPage';
import SettingsPage from './SettingsPage';
import ProfilePage from './ProfilePage';
import WarehousePage from './WarehousePage';
import FleetPage from './FleetPage';
import { NewShipmentModal } from './Modals';
import InvoiceModal from './InvoiceModal';
import { storageService } from '../services/storageService';
import { ShipmentStatus } from '../types';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isNewShipmentModalOpen, setIsNewShipmentModalOpen] = useState(false);
  const [selectedShipmentForInvoice, setSelectedShipmentForInvoice] = useState<ShipmentStatus | null>(null);
  const [notifications, setNotifications] = useState<{id: number, text: string}[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [user, setUser] = useState(storageService.getUser());
  const [walletBalance, setWalletBalance] = useState(storageService.getWalletBalance());
  const [recentShipments, setRecentShipments] = useState<ShipmentStatus[]>(storageService.getShipments());

  // Real-time synchronization with LocalDB
  useEffect(() => {
    const refreshData = () => {
      setRecentShipments(storageService.getShipments());
      setWalletBalance(storageService.getWalletBalance());
      setUser(storageService.getUser());
    };
    refreshData();
  }, [activeTab]);

  const addNotification = (text: string) => {
    const id = Date.now();
    setNotifications(prev => [{ id, text }, ...prev]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  };

  const handleCreateShipment = (data: any) => {
    const weight = parseFloat(data.weight);
    const shipmentFee = 150 + (weight * 45); // Standard operational pricing
    
    if (walletBalance < shipmentFee) {
      addNotification(`Insufficient balance. ₹${shipmentFee.toFixed(2)} required for this shipment.`);
      return;
    }

    const newShipment: ShipmentStatus = {
      id: 'LS' + Math.floor(100000 + Math.random() * 900000),
      currentStatus: 'Pickup Pending',
      origin: 'Client Warehouse',
      destination: data.deliveryPincode,
      estimatedArrival: '3-4 Business Days',
      weight: weight,
      invoiceValue: parseFloat(data.invoiceValue),
      history: [{
        date: new Date().toLocaleString('en-IN'),
        location: 'Origin',
        status: 'Order Manifested',
        details: 'Shipping label generated and ready for pickup.'
      }]
    };
    
    storageService.addShipment(newShipment);
    const newBal = storageService.updateWallet(shipmentFee, 'Debit', `Shipping Fee: ${newShipment.id}`);
    
    setRecentShipments(storageService.getShipments());
    setWalletBalance(newBal);
    addNotification(`Manifest for ${newShipment.id} generated successfully.`);
  };

  const menuItems = [
    { id: 'Overview', icon: '🏠' },
    { id: 'Shipments', icon: '📦' },
    { id: 'Warehouses', icon: '🏢' },
    { id: 'Fleet', icon: '🚛' },
    { id: 'Pickups', icon: '📅' },
    { id: 'Wallet', icon: '💳' },
    { id: 'Analytics', icon: '📊' },
    { id: 'KYC', icon: '🆔' },
    { id: 'Profile', icon: '👤' },
    { id: 'Settings', icon: '⚙️' }
  ];

  const liveShipmentsCount = recentShipments.filter(s => s.currentStatus !== 'Delivered').length;
  const deliveredCount = recentShipments.filter(s => s.currentStatus === 'Delivered').length;

  const renderContent = () => {
    switch (activeTab) {
      case 'Shipments': return <ShipmentsPage shipments={recentShipments} onViewInvoice={setSelectedShipmentForInvoice} />;
      case 'Warehouses': return <WarehousePage />;
      case 'Fleet': return <FleetPage />;
      case 'Pickups': return <PickupsPage />;
      case 'Wallet': return <WalletPage onBalanceUpdate={() => setWalletBalance(storageService.getWalletBalance())} />;
      case 'Analytics': return <AnalyticsPage shipments={recentShipments} />;
      case 'KYC': return <KycPage />;
      case 'Profile': return <ProfilePage onNotify={addNotification} />;
      case 'Settings': return <SettingsPage />;
      default: return (
        <div className="space-y-10">
          {/* Real Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Active Shipments', value: liveShipmentsCount.toString(), trend: 'Live', color: 'blue' },
              { label: 'Total Delivered', value: deliveredCount.toString(), trend: 'Lifetime', color: 'emerald' },
              { label: 'Wallet Balance', value: `₹${walletBalance.toLocaleString('en-IN')}`, trend: 'Spendable', color: 'indigo' },
              { label: 'KYC Status', value: user.kycStatus === 'verified' ? 'Verified' : user.kycStatus === 'pending' ? 'In Review' : 'Incomplete', trend: 'Account', color: 'orange' },
            ].map((s, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -z-10 group-hover:bg-blue-500/10 transition-colors"></div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{s.label}</span>
                  <span className="text-[10px] font-bold text-slate-400 opacity-60 uppercase">{s.trend}</span>
                </div>
                <div className="text-4xl font-black text-white">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-12 gap-8">
             <div className="col-span-12 lg:col-span-8 bg-slate-900 border border-slate-800 rounded-[3rem] p-10 overflow-hidden shadow-xl">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-white">Recent Activity</h2>
                  <button onClick={() => setActiveTab('Shipments')} className="text-blue-400 text-sm font-black hover:text-blue-300 transition-colors">Detailed View <span className="font-bold">→</span></button>
                </div>
                {recentShipments.length > 0 ? (
                  <ShipmentTable shipments={recentShipments.slice(0, 5)} onViewInvoice={setSelectedShipmentForInvoice} />
                ) : (
                  <div className="py-20 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">No Recent Shipments Found</div>
                )}
             </div>
             
             <div className="col-span-12 lg:col-span-4 space-y-8">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl">
                   <div className="absolute -right-6 -bottom-6 text-9xl opacity-10 group-hover:scale-110 transition-transform">🚀</div>
                   <h3 className="text-2xl font-black mb-2">Scale Up</h3>
                   <p className="text-blue-100 text-sm mb-8 leading-relaxed font-medium">Your current logistic throughput is {liveShipmentsCount} active orders. Optimization recommended for high volume zones.</p>
                   <button onClick={() => setIsNewShipmentModalOpen(true)} className="bg-white text-blue-700 px-8 py-3 rounded-2xl font-black text-sm shadow-2xl transition-all hover:-translate-y-1 active:scale-95">Ship New Order</button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-xl">
                  <h3 className="text-lg font-black mb-6 text-white">Network Health</h3>
                  <div className="space-y-6">
                     {[
                       { z: 'Carrier SLA', v: 98, c: 'bg-emerald-500' },
                       { z: 'Pickup Punctuality', v: 94, c: 'bg-blue-500' },
                       { z: 'Remittance Speed', v: 100, c: 'bg-indigo-500' }
                     ].map((item, i) => (
                       <div key={i}>
                         <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                           <span>{item.z}</span>
                           <span>{item.v}% Performance</span>
                         </div>
                         <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                           <div className={`${item.c} h-full transition-all duration-1000`} style={{ width: `${item.v}%` }}></div>
                         </div>
                       </div>
                     ))}
                  </div>
                </div>
             </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-200">
      <aside className={`transition-all duration-500 ease-in-out border-r border-slate-800 bg-slate-900/40 backdrop-blur-xl flex flex-col shrink-0 ${isSidebarCollapsed ? 'w-20' : 'w-72'}`}>
        <div className="p-6 flex items-center justify-between min-h-[80px]">
          {!isSidebarCollapsed && (
            <div className="flex items-center space-x-2 animate-in fade-in zoom-in duration-300">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/30">L</div>
              <span className="text-xl font-black tracking-tight text-white">Logi<span className="text-blue-500">Smart</span></span>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={`p-2.5 bg-slate-800/50 hover:bg-blue-600 rounded-xl transition-all duration-300 text-slate-400 hover:text-white border border-white/5 hover:border-blue-400/30 group shadow-lg ${isSidebarCollapsed ? 'mx-auto' : ''}`}
          >
            <div className={`transition-transform duration-500 ${isSidebarCollapsed ? '' : 'rotate-180'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </div>
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-300 font-semibold text-sm flex items-center ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                  : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {!isSidebarCollapsed && <span className="ml-4 animate-in slide-in-from-left-2">{item.id}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <button onClick={onLogout} className="w-full flex items-center px-4 py-3 text-slate-500 hover:text-red-400 hover:bg-red-500/5 rounded-2xl transition-all group">
            <span className="text-lg group-hover:scale-110 transition-transform">🚪</span>
            {!isSidebarCollapsed && <span className="ml-4 font-bold text-sm">Sign Out</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-slate-950">
        <header className="h-20 px-10 flex justify-between items-center border-b border-slate-900 bg-slate-950/50 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-black text-white tracking-tight animate-in slide-in-from-left-4">{activeTab}</h1>
            <div className="h-4 w-px bg-slate-800"></div>
            <div className="text-[10px] font-black bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full uppercase tracking-widest">Live Production Mode</div>
          </div>
          
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setIsNewShipmentModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-2xl font-black text-sm transition-all shadow-xl shadow-blue-600/30 active:scale-95"
            >
              + Ship New Package
            </button>
            <div 
              onClick={() => setActiveTab('Profile')}
              className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center font-black text-blue-400 cursor-pointer hover:border-blue-500/50 transition-all hover:scale-105"
            >
              {user.fullName.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
          <div key={activeTab} className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
            {renderContent()}
          </div>
        </div>

        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] flex flex-col space-y-4">
          {notifications.map(n => (
            <div key={n.id} className="bg-slate-900 border border-blue-500/30 text-white px-8 py-4 rounded-3xl shadow-2xl animate-in slide-in-from-bottom-10 flex items-center space-x-4 min-w-[300px]">
              <div className="w-8 h-8 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center font-bold">!</div>
              <span className="text-sm font-black">{n.text}</span>
            </div>
          ))}
        </div>
      </main>

      <NewShipmentModal 
        isOpen={isNewShipmentModalOpen} 
        onClose={() => setIsNewShipmentModalOpen(false)} 
        onSubmit={handleCreateShipment}
      />

      {selectedShipmentForInvoice && (
        <InvoiceModal 
          isOpen={!!selectedShipmentForInvoice} 
          onClose={() => setSelectedShipmentForInvoice(null)} 
          shipment={selectedShipmentForInvoice} 
          user={user}
        />
      )}
    </div>
  );
};

const ShipmentTable = ({ shipments, onViewInvoice }: any) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left">
      <thead>
        <tr className="text-slate-600 text-[10px] uppercase tracking-[0.2em] border-b border-slate-800/50">
          <th className="pb-6 font-black">Shipment ID</th>
          <th className="pb-6 font-black text-center">Current Hub</th>
          <th className="pb-6 font-black text-center">Status</th>
          <th className="pb-6 font-black text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800/30">
        {shipments.map((s: any, i: number) => (
          <tr key={i} className="group hover:bg-white/[0.01] transition-colors cursor-pointer">
            <td className="py-6 font-mono text-xs font-bold text-blue-400 group-hover:text-blue-300">{s.id}</td>
            <td className="py-6 text-center text-xs text-slate-400 font-bold">{s.origin}</td>
            <td className="py-6 text-center">
              <span className={`text-[9px] font-black px-4 py-1.5 rounded-full border ${
                s.currentStatus === 'Delivered' ? 'text-emerald-400 bg-emerald-400/5 border-emerald-400/20' : 
                'text-blue-400 bg-blue-400/5 border-blue-400/20'
              }`}>
                {s.currentStatus.toUpperCase()}
              </span>
            </td>
            <td className="py-6 text-right">
              <button 
                onClick={(e) => { e.stopPropagation(); onViewInvoice(s); }}
                className="text-[10px] font-black uppercase text-blue-500 hover:text-blue-400 bg-blue-500/10 px-4 py-2 rounded-xl transition-all"
              >
                Invoice
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Dashboard;
