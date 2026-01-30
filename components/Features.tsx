
import React from 'react';

const features = [
  {
    title: "Pan-India Courier Network",
    description: "Connect with 25+ Indian carriers including Delhivery, BlueDart, and XpressBees via a single powerful API.",
    icon: "🇮🇳",
    tag: "Most Popular"
  },
  {
    title: "Regional Fulfillment",
    description: "Strategic warehouses in NCR, Mumbai, and Bangalore to store inventory closer to your customers.",
    icon: "🏢"
  },
  {
    title: "COD with Early Payouts",
    description: "Handle Cash on Delivery seamlessly with the fastest remittance in the industry (within 24 hours).",
    icon: "💸"
  },
  {
    title: "Hyperlocal Inter-city",
    description: "Same-day delivery across major metros using our optimized local delivery rider network.",
    icon: "🛵"
  },
  {
    title: "GST-Ready Invoicing",
    description: "Automated GST-compliant tax invoices and E-way bill generation for hassle-free shipping.",
    icon: "📄"
  },
  {
    title: "RTO Management",
    description: "AI-powered RTO prediction to minimize undelivered orders and reduce reverse logistics costs.",
    icon: "🔄"
  }
];

const Features: React.FC = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Built for the <br />Indian Seller.</h2>
            <p className="text-slate-400 text-xl leading-relaxed">
              We've consolidated India's fragmented logistics landscape into one intuitive interface. Build your brand on top of our Pan-India infrastructure.
            </p>
          </div>
          <div className="hidden lg:block pb-2">
            <button className="text-blue-400 font-bold flex items-center group">
              View All 29,000+ Pincodes 
              <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
            </button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="relative p-10 rounded-[2.5rem] border border-slate-800 bg-slate-900/30 hover:bg-slate-900/60 hover:border-blue-500/30 transition-all duration-500 group overflow-hidden">
              {feature.tag && (
                <span className="absolute top-6 right-8 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-blue-500/20">
                  {feature.tag}
                </span>
              )}
              <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform shadow-xl">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed text-lg">{feature.description}</p>
              
              <div className="mt-8 pt-8 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                <a href="#" className="text-sm font-bold text-slate-300 hover:text-white flex items-center">
                  Learn more <span className="ml-2">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
