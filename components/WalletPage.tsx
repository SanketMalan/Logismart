
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { Transaction } from '../types';

interface WalletPageProps {
  onBalanceUpdate: () => void;
}

const WalletPage: React.FC<WalletPageProps> = ({ onBalanceUpdate }) => {
  const [balance, setBalance] = useState(storageService.getWalletBalance());
  const [transactions, setTransactions] = useState<Transaction[]>(storageService.getTransactions());
  const [isRecharging, setIsRecharging] = useState(false);

  useEffect(() => {
    setBalance(storageService.getWalletBalance());
    setTransactions(storageService.getTransactions());
  }, []);

  const handleRecharge = () => {
    setIsRecharging(true);
    setTimeout(() => {
      const amount = 2000;
      const newBal = storageService.updateWallet(amount, 'Credit', 'Wallet Recharge - UPI');
      setBalance(newBal);
      setTransactions(storageService.getTransactions());
      onBalanceUpdate();
      setIsRecharging(false);
    }, 1200);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-8 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:scale-110 transition-transform">💰</div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Actual Wallet Balance</p>
          <h2 className="text-5xl font-black text-white">₹{balance.toLocaleString('en-IN')}</h2>
          <div className="mt-8 flex gap-3">
             <button 
               onClick={handleRecharge}
               disabled={isRecharging}
               className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50"
             >
               {isRecharging ? 'Processing...' : 'Quick Recharge ₹2000'}
             </button>
             <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-all">Withdraw Payouts</button>
          </div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem]">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Settled COD Funds</p>
           <h2 className="text-4xl font-black text-emerald-400">₹0.00</h2>
           <p className="text-xs text-slate-500 mt-4 leading-relaxed">All COD remittances are processed within 24 hours of delivery. Next cycle starts Monday.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col justify-center">
           <div className="flex justify-between items-center mb-4">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Monthly Logistics Spend</span>
             <span className="text-xs text-red-400 font-bold">₹{(5000 - balance > 0 ? 5000 - balance : 0).toLocaleString()}</span>
           </div>
           <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
             <div className="bg-blue-500 h-full w-[25%]"></div>
           </div>
           <p className="text-[10px] text-slate-500 mt-4 uppercase font-bold tracking-tighter">Your current shipping volume is within standard tier limits.</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-xl">
        <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/20">
          <h3 className="text-lg font-black">Transaction History</h3>
          <div className="flex gap-2">
            <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Download Statement</button>
          </div>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-950/50">
            <tr className="text-slate-500 text-[10px] uppercase tracking-[0.2em] border-b border-slate-800">
              <th className="px-8 py-4 font-black">Ref ID</th>
              <th className="py-4 font-black">Narration</th>
              <th className="py-4 font-black">Amount</th>
              <th className="py-4 font-black">Date</th>
              <th className="px-8 py-4 font-black text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {transactions.map((t, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-8 py-4 font-mono text-xs text-slate-500 font-bold">{t.id}</td>
                <td className="py-4">
                  <div className="text-sm font-bold text-slate-200">{t.description}</div>
                  <div className={`text-[10px] font-black uppercase tracking-widest ${t.type === 'Credit' ? 'text-emerald-500' : 'text-slate-500'}`}>{t.type}</div>
                </td>
                <td className={`py-4 text-sm font-black ${t.type === 'Credit' ? 'text-emerald-400' : 'text-white'}`}>
                  {t.type === 'Credit' ? '+' : '-'}{t.amount}
                </td>
                <td className="py-4 text-xs text-slate-500 font-bold">{t.date}</td>
                <td className="px-8 py-4 text-right">
                  <span className="text-[9px] font-black text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20 uppercase">Completed</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length === 0 && (
          <div className="py-20 text-center text-slate-500 italic">No wallet activity recorded yet.</div>
        )}
      </div>
    </div>
  );
};

export default WalletPage;
