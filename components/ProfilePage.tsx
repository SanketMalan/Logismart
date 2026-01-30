
import React, { useState, useRef, useEffect } from 'react';
import { storageService } from '../services/storageService';

interface ProfilePageProps {
  onNotify: (text: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onNotify }) => {
  const [user, setUser] = useState(storageService.getUser());
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const u = storageService.getUser();
    setUser(u);
    setFormData(prev => ({ ...prev, fullName: u.fullName, email: u.email }));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveUser({
      fullName: formData.fullName,
      email: formData.email
    });
    onNotify("Profile preferences saved to cloud.");
    setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-10 p-10 bg-slate-900 border border-slate-800 rounded-[3rem] shadow-xl">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="relative group cursor-pointer"
        >
          <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-800 border-4 border-slate-700 group-hover:border-blue-500 transition-all flex items-center justify-center">
            {avatar ? (
              <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-black text-blue-400">
                {formData.fullName.split(' ').map(n => n[0]).join('')}
              </span>
            )}
          </div>
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
            <span className="text-[10px] font-black uppercase text-white tracking-widest">Update</span>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange} 
            accept="image/*"
          />
        </div>
        
        <div className="text-center md:text-left flex-1">
          <h2 className="text-3xl font-black text-white mb-1 tracking-tight">{formData.fullName}</h2>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mb-4">Account ID: {user.id}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
             <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest">
               {user.kycStatus === 'verified' ? 'Verified Partner' : 'Identity Verification Pending'}
             </div>
             <div className="bg-slate-800 px-3 py-1 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">System Admin Access</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <section className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 md:p-14 overflow-hidden relative shadow-2xl">
          <h3 className="text-xl font-black text-white mb-8">Personal Information</h3>
          <div className="grid md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Preferred Name</label>
              <input 
                type="text" 
                value={formData.fullName}
                onChange={e => setFormData({...formData, fullName: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 focus:border-blue-500 focus:outline-none transition-all font-bold text-slate-200" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Primary Email Address</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 focus:border-blue-500 focus:outline-none transition-all font-bold text-slate-200" 
              />
            </div>
          </div>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 md:p-14 overflow-hidden relative shadow-2xl">
          <h3 className="text-xl font-black text-white mb-2">Access Credentials</h3>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-10">Manage platform authentication</p>
          
          <div className="space-y-8 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Current Password</label>
              <input 
                type="password" 
                value={formData.currentPassword}
                onChange={e => setFormData({...formData, currentPassword: e.target.value})}
                placeholder="Required to confirm identity"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 focus:border-blue-500 focus:outline-none transition-all font-mono" 
              />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">New Security Phrase</label>
                <input 
                  type="password" 
                  value={formData.newPassword}
                  onChange={e => setFormData({...formData, newPassword: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 focus:border-blue-500 focus:outline-none transition-all font-mono" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Verify Phrase</label>
                <input 
                  type="password" 
                  value={formData.confirmPassword}
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 focus:border-blue-500 focus:outline-none transition-all font-mono" 
                />
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
           <button 
             type="submit"
             className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-5 rounded-[2rem] font-black text-sm transition-all shadow-2xl shadow-blue-600/30 active:scale-95"
           >
             Synchronize Profile
           </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
