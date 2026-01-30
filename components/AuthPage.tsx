
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';

interface AuthPageProps {
  onSuccess: () => void;
  onBack: () => void;
  initialMode: 'login' | 'signup';
}

const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onBack, initialMode }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [step, setStep] = useState(1); // 1: Input, 2: OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    fullName: '',
    otp: ''
  });

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (method === 'email' && !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (method === 'phone' && formData.phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    if (mode === 'signup' && !formData.fullName) {
      setError('Full name is required');
      return;
    }

    setLoading(true);
    // Simulate API call to send OTP
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.otp.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    // Simulate Verification
    setTimeout(() => {
      storageService.saveUser({
        email: formData.email,
        phone: formData.phone,
        fullName: formData.fullName || (formData.phone === '9999999999' ? 'Amit Bhardwaj' : 'User'),
        isLoggedIn: true
      });
      setLoading(false);
      onSuccess();
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    // Simulate Google OAuth flow
    setTimeout(() => {
      storageService.saveUser({
        email: 'google.user@gmail.com',
        fullName: 'Google User',
        isLoggedIn: true
      });
      setLoading(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[300] bg-slate-950 flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-500">
      {/* Left Panel: Branding & Features */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 relative items-center justify-center p-20 overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/10"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1500" 
            alt="Logistics Background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 max-w-lg">
          <div onClick={onBack} className="cursor-pointer flex items-center space-x-2 mb-16 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-xl shadow-blue-600/20">L</div>
            <span className="text-2xl font-black text-white tracking-tight">LogiSmart</span>
          </div>
          
          <h1 className="text-5xl font-black text-white leading-tight mb-8">
            Empowering <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Indian eCommerce</span> <br />
            Infrastructure.
          </h1>
          
          <div className="space-y-6">
            {[
              { icon: '🚀', text: 'Instant COD Remittances within 24 hours.' },
              { icon: '📍', text: 'Reach 29,000+ pincodes across India.' },
              { icon: '🤖', text: 'AI-driven route & cost optimization.' }
            ].map((f, i) => (
              <div key={i} className="flex items-center space-x-4 bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-[2rem]">
                <span className="text-2xl">{f.icon}</span>
                <span className="text-slate-300 font-bold text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="absolute bottom-10 left-20 right-20 flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
          <span>© 2025 LOGISMART INC.</span>
          <span>ENTERPRISE GRADE</span>
        </div>
      </div>

      {/* Right Panel: Auth Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-20 relative bg-slate-950">
        <button 
          onClick={onBack}
          className="absolute top-10 right-10 md:left-10 md:right-auto p-4 text-slate-500 hover:text-white transition-colors flex items-center space-x-2 font-bold text-sm"
        >
          <span>←</span> <span>Back</span>
        </button>

        <div className="w-full max-w-md">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-4xl font-black text-white mb-3">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-500 font-medium">
              {mode === 'login' 
                ? 'Access your logistics dashboard and track shipments.' 
                : 'Join 50,000+ Indian brands shipping with LogiSmart.'}
            </p>
          </div>

          {step === 1 ? (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
              {/* Google Button */}
              <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-slate-50 text-slate-900 py-4 rounded-2xl font-bold text-sm transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center space-x-4 py-2">
                <div className="flex-1 h-px bg-slate-800"></div>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">or use your details</span>
                <div className="flex-1 h-px bg-slate-800"></div>
              </div>

              {/* Tabs */}
              <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800">
                <button 
                  onClick={() => {setMethod('email'); setError('');}}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${method === 'email' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Email
                </button>
                <button 
                  onClick={() => {setMethod('phone'); setError('');}}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${method === 'phone' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Phone
                </button>
              </div>

              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold animate-in shake">{error}</div>}

              <form onSubmit={handleSendOtp} className="space-y-6">
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                      placeholder="Rajesh Kumar" 
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 font-bold text-white placeholder:text-slate-600" 
                    />
                  </div>
                )}

                {method === 'email' ? (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Work Email</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="rajesh@company.com" 
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 font-bold text-white placeholder:text-slate-600" 
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mobile Number</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 font-bold border-r border-slate-800 pr-4">+91</span>
                      <input 
                        required
                        type="tel" 
                        maxLength={10}
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                        placeholder="00000 00000" 
                        className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-20 pr-6 py-4 focus:outline-none focus:border-blue-500 font-mono text-lg tracking-widest text-white placeholder:text-slate-600" 
                      />
                    </div>
                  </div>
                )}

                <button 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-[2rem] font-black text-sm text-white transition-all shadow-2xl shadow-blue-600/20 active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'Sending Code...' : `Verify via ${method === 'email' ? 'Email' : 'SMS'}`}
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
              <div className="text-center p-6 bg-blue-600/5 border border-blue-500/10 rounded-3xl">
                <p className="text-sm font-bold text-blue-400">
                  A verification code has been sent to <br />
                  <span className="text-white mt-1 block">{method === 'email' ? formData.email : `+91 ${formData.phone}`}</span>
                </p>
              </div>

              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold animate-in shake">{error}</div>}

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">6-Digit OTP</label>
                  <input 
                    type="text" 
                    autoFocus
                    maxLength={6}
                    value={formData.otp}
                    onChange={e => setFormData({...formData, otp: e.target.value.replace(/\D/g, '')})}
                    placeholder="0 0 0 0 0 0" 
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-5 focus:outline-none focus:border-blue-500 font-mono text-center text-3xl tracking-[0.5em] text-white placeholder:text-slate-600" 
                  />
                </div>
                <button 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-5 rounded-[2rem] font-black text-sm text-white transition-all shadow-2xl active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Complete Authentication'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="w-full text-center text-xs font-bold text-slate-500 hover:text-blue-400 transition-colors uppercase tracking-widest"
                >
                  Change {method === 'email' ? 'Email' : 'Number'}
                </button>
              </form>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => {setMode(mode === 'login' ? 'signup' : 'login'); setStep(1); setError('');}}
                className="ml-2 text-blue-500 hover:text-blue-400 transition-colors"
              >
                {mode === 'login' ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
