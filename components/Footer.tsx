
import React, { useState } from 'react';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <button onClick={scrollToTop} className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">L</div>
              <span className="text-xl font-bold tracking-tight text-white">Logi<span className="text-blue-500">Smart</span></span>
            </button>
            <p className="text-slate-500 text-sm leading-relaxed">
              Modern logistics infrastructure for high-growth teams. Built with performance and scalability in mind.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-slate-400">Platform</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#features" className="hover:text-blue-400 transition-colors">Route Optimization</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">API Reference</a></li>
              <li><a href="#features" className="hover:text-blue-400 transition-colors">Carrier Network</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Custom Dashboards</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-slate-400">Company</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Press Kit</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-slate-400">Newsletter</h4>
            <p className="text-slate-500 text-sm mb-4">Get shipping tips and product updates.</p>
            {status === 'success' ? (
              <div className="text-green-400 text-sm font-bold bg-green-500/10 p-4 rounded-xl border border-green-500/20">
                Thanks for subscribing! Check your inbox soon.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email" 
                  className="bg-slate-900 border border-slate-800 rounded-l-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-blue-500" 
                />
                <button 
                  disabled={status === 'loading'}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg text-sm font-bold transition-colors disabled:opacity-50"
                >
                  {status === 'loading' ? '...' : '→'}
                </button>
              </form>
            )}
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-900 flex flex-col md:row justify-between items-center text-xs text-slate-600 gap-4">
          <p>© 2025 LogiSmart Inc. All rights reserved.</p>
          <div className="flex space-x-8">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
            <a href="#" className="hover:text-slate-400">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
