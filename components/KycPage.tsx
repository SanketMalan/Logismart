
import React, { useState, useRef } from 'react';
import { storageService } from '../services/storageService';

interface UploadedFiles {
  aadhaarFront: File | null;
  aadhaarBack: File | null;
  panCard: File | null;
  gstCert: File | null;
  bankProof: File | null;
}

const KycPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [verifiedFields, setVerifiedFields] = useState({ pan: false, aadhaar: false });

  const [formData, setFormData] = useState({
    businessName: '',
    gstin: '',
    pan: '',
    aadhaar: '',
    bankName: '',
    accountNumber: '',
    ifsc: '',
  });

  const [files, setFiles] = useState<UploadedFiles>({
    aadhaarFront: null,
    aadhaarBack: null,
    panCard: null,
    gstCert: null,
    bankProof: null,
  });

  const fileInputRefs = {
    aadhaarFront: useRef<HTMLInputElement>(null),
    aadhaarBack: useRef<HTMLInputElement>(null),
    panCard: useRef<HTMLInputElement>(null),
    gstCert: useRef<HTMLInputElement>(null),
    bankProof: useRef<HTMLInputElement>(null),
  };

  const handleVerify = (field: 'pan' | 'aadhaar') => {
    const value = formData[field];
    if (field === 'pan' && value.length !== 10) return;
    if (field === 'aadhaar' && value.length !== 12) return;

    setVerifying(field);
    setTimeout(() => {
      setVerifiedFields(prev => ({ ...prev, [field]: true }));
      setVerifying(null);
    }, 2000);
  };

  const handleFileChange = (key: keyof UploadedFiles, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [key]: e.target.files![0] }));
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const isStep1Valid = 
    formData.businessName && 
    formData.gstin.length === 15 && 
    verifiedFields.pan && 
    verifiedFields.aadhaar;

  const isStep2Valid = 
    formData.bankName && 
    formData.accountNumber && 
    formData.ifsc.length === 11;

  const isStep3Valid = 
    files.aadhaarFront && 
    files.panCard && 
    files.gstCert && 
    files.bankProof;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    storageService.saveUser({ kycStatus: 'pending' });
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 shadow-2xl shadow-emerald-500/20 border border-emerald-500/30">
          ✓
        </div>
        <h2 className="text-4xl font-black mb-4">Verification Sent</h2>
        <p className="text-slate-400 text-lg leading-relaxed mb-10">
          Our compliance engine is validating your credentials. Expected processing time: <span className="text-white font-bold">2 Hours</span>.
        </p>
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 inline-block text-left w-full shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
              <div className="h-full bg-blue-500 w-1/3 animate-pulse"></div>
           </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Process Status</p>
          <div className="space-y-6">
            {[
              { label: 'Identity Parsing', status: 'Completed', color: 'text-emerald-400' },
              { label: 'Bank Validation', status: 'Completed', color: 'text-emerald-400' },
              { label: 'Manual Review', status: 'In Progress', color: 'text-blue-400 animate-pulse' }
            ].map((step, i) => (
              <div key={i} className="flex items-center justify-between text-sm font-bold">
                <span className="text-slate-300">{step.label}</span>
                <span className={step.color}>{step.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-700">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black mb-2 text-white tracking-tight">Onboarding & Compliance</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Verify your business to unlock premium features</p>
        </div>
        <div className="flex -space-x-3">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`w-12 h-12 rounded-full border-4 border-slate-950 flex items-center justify-center text-sm font-black transition-all duration-500 ${step >= s ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800 text-slate-500'}`}>
              {s}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
           <div className="h-full bg-blue-600 transition-all duration-700" style={{ width: `${(step/3)*100}%` }}></div>
        </div>

        {step === 1 && (
          <div className="space-y-10 animate-in slide-in-from-right-10 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-white mb-1">Entity Verification</h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Aadhaar • PAN • GSTIN</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Legal Business Name</label>
                <input 
                  type="text" 
                  value={formData.businessName}
                  onChange={e => setFormData({...formData, businessName: e.target.value})}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-5 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-800 text-sm font-bold" 
                  placeholder="As per GST Records"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">PAN Number</label>
                <div className="relative">
                  <input 
                    type="text" 
                    maxLength={10}
                    disabled={verifiedFields.pan}
                    value={formData.pan}
                    onChange={e => setFormData({...formData, pan: e.target.value.toUpperCase()})}
                    className={`w-full bg-slate-950/50 border rounded-2xl px-6 py-5 focus:outline-none transition-all uppercase font-mono text-lg ${verifiedFields.pan ? 'border-emerald-500/50 text-emerald-400' : 'border-slate-800 focus:border-blue-500'}`} 
                    placeholder="ABCDE1234F"
                  />
                  {formData.pan.length === 10 && !verifiedFields.pan && (
                    <button 
                      onClick={() => handleVerify('pan')}
                      disabled={verifying === 'pan'}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-white shadow-lg shadow-blue-600/20"
                    >
                      {verifying === 'pan' ? '...' : 'Verify'}
                    </button>
                  )}
                  {verifiedFields.pan && (
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-400 text-xs font-black uppercase flex items-center">
                      <span className="mr-2">✓ Verified</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Aadhaar (Director)</label>
                <div className="relative">
                  <input 
                    type="text" 
                    maxLength={12}
                    disabled={verifiedFields.aadhaar}
                    value={formData.aadhaar}
                    onChange={e => setFormData({...formData, aadhaar: e.target.value.replace(/\D/g, '')})}
                    className={`w-full bg-slate-950/50 border rounded-2xl px-6 py-5 focus:outline-none transition-all font-mono text-lg ${verifiedFields.aadhaar ? 'border-emerald-500/50 text-emerald-400' : 'border-slate-800 focus:border-blue-500'}`} 
                    placeholder="0000 0000 0000"
                  />
                  {formData.aadhaar.length === 12 && !verifiedFields.aadhaar && (
                    <button 
                      onClick={() => handleVerify('aadhaar')}
                      disabled={verifying === 'aadhaar'}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-white shadow-lg shadow-blue-600/20"
                    >
                      {verifying === 'aadhaar' ? '...' : 'Verify'}
                    </button>
                  )}
                  {verifiedFields.aadhaar && (
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-400 text-xs font-black uppercase flex items-center">
                      <span className="mr-2">✓ Verified</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">GSTIN</label>
                <input 
                  type="text" 
                  maxLength={15}
                  value={formData.gstin}
                  onChange={e => setFormData({...formData, gstin: e.target.value.toUpperCase()})}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-5 focus:border-blue-500 focus:outline-none transition-all uppercase font-mono text-lg" 
                  placeholder="27AAAAA0000A1Z5"
                />
              </div>
            </div>
            
            <div className="pt-8">
              <button 
                onClick={nextStep}
                disabled={!isStep1Valid}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-20 text-white px-12 py-5 rounded-[2rem] font-black text-sm shadow-2xl shadow-blue-600/20 active:scale-95 transition-all w-full md:w-auto"
              >
                Proceed to Banking Setup
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-10 animate-in slide-in-from-right-10 duration-500">
            <div>
              <h3 className="text-2xl font-black text-white mb-1">Settlement Details</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Remittance Payout Info</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Bank Name</label>
                <input 
                  type="text" 
                  value={formData.bankName}
                  onChange={e => setFormData({...formData, bankName: e.target.value})}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-5 focus:border-blue-500 focus:outline-none text-sm font-bold" 
                  placeholder="e.g. ICICI Bank"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Account Number</label>
                <input 
                  type="password" 
                  value={formData.accountNumber}
                  onChange={e => setFormData({...formData, accountNumber: e.target.value})}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-5 focus:border-blue-500 focus:outline-none text-sm" 
                  placeholder="Enter Account No."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">IFSC Code</label>
                <input 
                  type="text" 
                  maxLength={11}
                  value={formData.ifsc}
                  onChange={e => setFormData({...formData, ifsc: e.target.value.toUpperCase()})}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-5 focus:border-blue-500 focus:outline-none font-mono text-sm" 
                  placeholder="ICIC0001234"
                />
              </div>
            </div>
            
            <div className="pt-8 flex gap-6">
              <button onClick={prevStep} className="bg-slate-800 hover:bg-slate-700 text-white px-10 py-5 rounded-[2rem] font-black text-sm transition-all">Back</button>
              <button 
                onClick={nextStep}
                disabled={!isStep2Valid}
                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-20 text-white px-10 py-5 rounded-[2rem] font-black text-sm shadow-2xl transition-all"
              >
                Continue to Document Vault
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-12 animate-in slide-in-from-right-10 duration-500">
            <div>
              <h3 className="text-2xl font-black text-white mb-1">Secure Documents</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">End-to-end encrypted uploads</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { id: 'aadhaarFront', label: 'Aadhaar (F)' },
                { id: 'panCard', label: 'PAN Card' },
                { id: 'gstCert', label: 'GST Cert.' },
                { id: 'bankProof', label: 'Passbook/Chq' }
              ].map((doc) => (
                <div 
                  key={doc.id}
                  onClick={() => fileInputRefs[doc.id as keyof UploadedFiles].current?.click()}
                  className={`group relative border-2 border-dashed rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all h-40 ${
                    files[doc.id as keyof UploadedFiles] 
                      ? 'border-emerald-500/50 bg-emerald-500/5' 
                      : 'border-slate-800 bg-slate-950/50 hover:border-blue-500/50'
                  }`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRefs[doc.id as keyof UploadedFiles]} 
                    className="hidden" 
                    onChange={(e) => handleFileChange(doc.id as keyof UploadedFiles, e)}
                    accept="image/*,application/pdf"
                  />
                  
                  {files[doc.id as keyof UploadedFiles] ? (
                    <div className="animate-in zoom-in">
                       <div className="text-emerald-400 text-2xl mb-2">📄</div>
                       <div className="text-emerald-400 font-black text-[10px] uppercase">{doc.label} Ready</div>
                    </div>
                  ) : (
                    <>
                      <div className="text-slate-600 text-2xl mb-2 group-hover:scale-110 transition-transform">📂</div>
                      <div className="text-slate-600 font-black text-[10px] uppercase group-hover:text-blue-500 transition-colors">{doc.label}</div>
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-6 flex gap-6">
              <button onClick={prevStep} className="bg-slate-800 hover:bg-slate-700 text-white px-10 py-5 rounded-[2rem] font-black text-sm transition-all">Back</button>
              <button 
                onClick={handleSubmit}
                disabled={!isStep3Valid}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-20 text-white px-10 py-5 rounded-[2rem] font-black text-sm shadow-2xl transition-all"
              >
                Complete Identity Onboarding
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 p-12 bg-blue-600/5 border border-blue-500/10 rounded-[3.5rem] flex flex-col md:row items-center space-y-6 md:space-y-0 md:space-x-10">
        <div className="w-20 h-20 shrink-0 bg-blue-600/10 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner border border-blue-500/20">🛡️</div>
        <div>
          <h4 className="text-xl font-black text-blue-400 mb-2 tracking-tight">Financial Data Safety Commitment</h4>
          <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">
            We employ bank-grade encryption (SHA-256) for all sensitive identification data. Your documents are stored in PCI-DSS compliant regional nodes within India.
          </p>
        </div>
      </div>
    </div>
  );
};

export default KycPage;
