
import React from 'react';
import { ShipmentStatus, UserProfile } from '../types';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: ShipmentStatus;
  user: UserProfile;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, shipment, user }) => {
  if (!isOpen) return null;

  const baseCharge = 150;
  const weightCharge = (shipment.weight || 0.5) * 45;
  const tax = (baseCharge + weightCharge) * 0.18;
  const total = baseCharge + weightCharge + tax;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white text-slate-900 rounded-[2.5rem] w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] shadow-[0_0_100px_rgba(255,255,255,0.1)]">
        <div className="p-10 border-b border-slate-100 flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">L</div>
              <span className="text-xl font-black tracking-tight">LogiSmart</span>
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Tax Invoice</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Order Ref: {shipment.id}</p>
          </div>
          <div className="text-right">
             <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors mb-4">✕</button>
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Issued</div>
             <div className="text-sm font-bold">{new Date().toLocaleDateString('en-IN')}</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-12">
           <div className="grid grid-cols-2 gap-10">
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Billed To</p>
                 <h3 className="font-black text-lg">{user.fullName}</h3>
                 <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                    {user.email}<br />
                    {user.phone}
                 </p>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Origin Hub</p>
                 <h3 className="font-black text-lg">{shipment.origin}</h3>
                 <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                    LogiSmart Fulfillment Center<br />
                    Bhiwandi, Maharashtra 421302
                 </p>
              </div>
           </div>

           <div className="border border-slate-100 rounded-3xl overflow-hidden">
              <table className="w-full text-left text-sm">
                 <thead className="bg-slate-50">
                    <tr className="text-slate-500 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
                       <th className="px-6 py-4">Description</th>
                       <th className="px-6 py-4 text-center">Weight</th>
                       <th className="px-6 py-4 text-right">Amount</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    <tr>
                       <td className="px-6 py-6 font-bold">Standard Logistic Service - Pan India</td>
                       <td className="px-6 py-6 text-center font-mono">{shipment.weight || 0.5} KG</td>
                       <td className="px-6 py-6 text-right font-mono">₹{(baseCharge + weightCharge).toFixed(2)}</td>
                    </tr>
                 </tbody>
              </table>
           </div>

           <div className="flex justify-end">
              <div className="w-64 space-y-4">
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Subtotal</span>
                    <span className="font-mono font-bold">₹{(baseCharge + weightCharge).toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">GST (18%)</span>
                    <span className="font-mono font-bold">₹{tax.toFixed(2)}</span>
                 </div>
                 <div className="pt-4 border-t border-slate-100 flex justify-between">
                    <span className="font-black uppercase tracking-widest text-xs">Total Amount</span>
                    <span className="text-xl font-black">₹{total.toFixed(2)}</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="p-10 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
           <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest max-w-sm">
              Computer generated invoice. No signature required. LogiSmart Inc. GSTIN: 27AAAAA0000A1Z5.
           </div>
           <button 
             onClick={() => window.print()}
             className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-slate-800 transition-all active:scale-95 shadow-xl"
           >
             Print / Download
           </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
