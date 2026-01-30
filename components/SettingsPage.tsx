
import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <div className="max-w-4xl space-y-10 animate-in fade-in duration-500">
      <section className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-800">
          <h3 className="text-xl font-bold">Business Profile</h3>
          <p className="text-sm text-slate-500">Update your brand and contact settings across the platform.</p>
        </div>
        <div className="p-10 space-y-8">
           <div className="grid md:grid-cols-2 gap-8">
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Store Name</label>
                <input type="text" defaultValue="Aura Fashion India" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-3.5 focus:border-blue-500 focus:outline-none" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Support Email</label>
                <input type="email" defaultValue="care@aurafashion.in" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-3.5 focus:border-blue-500 focus:outline-none" />
             </div>
           </div>
           <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-600/20">Save Profile</button>
        </div>
      </section>

      <section className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-800">
          <h3 className="text-xl font-bold">API & Integration</h3>
          <p className="text-sm text-slate-500">Manage your production and sandbox keys for platform integration.</p>
        </div>
        <div className="p-10 space-y-6">
           <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Production Secret Key</p>
                <p className="font-mono text-xs text-blue-400">sk_live_90213xxxxxxxxxxxxxxxxxxxxxxx</p>
              </div>
              <button className="text-xs font-bold text-slate-500 hover:text-white transition-colors">Copy Key</button>
           </div>
           <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Webhook URL</p>
                <p className="font-mono text-xs text-slate-400 italic">No endpoint configured</p>
              </div>
              <button className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors">Add Endpoint</button>
           </div>
        </div>
      </section>

      <section className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-800">
          <h3 className="text-xl font-bold text-red-500">Danger Zone</h3>
          <p className="text-sm text-slate-500">Permanent account actions and subscription management.</p>
        </div>
        <div className="p-10">
           <button className="text-sm font-bold text-red-500/80 hover:text-red-500 hover:bg-red-500/10 px-6 py-3 rounded-xl border border-red-500/20 transition-all">Deactivate Account</button>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;
