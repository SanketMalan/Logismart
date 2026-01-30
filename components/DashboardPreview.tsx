
import React, { useState } from 'react';

const DashboardPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <section className="py-20 bg-slate-900/50">
      <div className="container mx-auto px-6">
        <div className="relative max-w-6xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden float-animation">
            {/* Window Header */}
            <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 bg-red-500/20 rounded-full border border-red-500/40"></div>
                  <div className="w-3 h-3 bg-yellow-500/20 rounded-full border border-yellow-500/40"></div>
                  <div className="w-3 h-3 bg-green-500/20 rounded-full border border-green-500/40"></div>
                </div>
                <div className="ml-4 bg-slate-950 px-3 py-1 rounded text-[10px] text-slate-500 font-mono">app.logismart.io/dashboard</div>
              </div>
              <div className="flex items-center space-x-4">
                <button onClick={handleRefresh} className={`text-slate-500 hover:text-white transition-all ${isRefreshing ? 'animate-spin' : ''}`}>
                  🔄
                </button>
              </div>
            </div>
            
            <div className="p-8 grid grid-cols-12 gap-6 h-[500px]">
              <div className="col-span-3 space-y-2">
                {['Overview', 'Shipments', 'Orders', 'Analytics', 'Settings'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                      activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
                <div className="pt-20">
                   <div className="bg-slate-900 rounded-xl p-4 border border-white/5">
                      <p className="text-[10px] uppercase font-bold text-slate-500 mb-2">Usage Limit</p>
                      <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full w-[65%]"></div>
                      </div>
                   </div>
                </div>
              </div>
              
              <div className="col-span-9 space-y-6">
                <div className={`grid grid-cols-3 gap-4 transition-opacity duration-300 ${isRefreshing ? 'opacity-50' : 'opacity-100'}`}>
                  {[
                    { l: 'Revenue', v: '$12,450', t: '+12%' },
                    { l: 'Shipments', v: '1,204', t: '+4%' },
                    { l: 'Returns', v: '24', t: '-2%' }
                  ].map((item, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">{item.l}</div>
                      <div className="flex items-end justify-between">
                        <div className="text-xl font-black">{item.v}</div>
                        <div className={`text-[10px] font-bold ${item.t.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{item.t}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className={`bg-slate-900 border border-slate-800 rounded-xl p-6 h-full transition-all duration-500 ${isRefreshing ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-sm font-bold text-slate-300">{activeTab} Activity</h4>
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                    </div>
                  </div>
                  <div className="flex items-end space-x-2 h-40">
                    {[30, 60, 45, 90, 75, 40, 55, 80, 65, 95, 30, 40, 60, 80].map((h, i) => (
                      <div 
                        key={i} 
                        className="flex-1 bg-gradient-to-t from-blue-600/20 to-blue-500/60 rounded-t-md hover:from-blue-600 hover:to-blue-400 transition-all group relative" 
                        style={{ height: `${h}%` }}
                      >
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-slate-950 text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {h}%
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
