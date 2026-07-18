// Fix: Imported useEffect from react
import { useEffect } from "react";
// Fix: Imported useLocation from react-router-dom to watch route paths
import { useLocation } from "react-router-dom";
// Fixed Import: Removed unused icons to fix ESLint 'no-unused-vars' warnings
import { FiShield, FiShoppingBag, FiTruck, FiHeadphones } from "react-icons/fi";

const AboutUs = () => {
  const { pathname } = useLocation();

  // 100% Bulletproof Scroll to Top Fix
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    
    const timeoutId = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, 10);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  const stats = [
    { label: "Curated Collection", value: "Premium Quality", icon: <FiShoppingBag className="w-5 h-5 text-purple-600" /> },
    { label: "Processing & Delivery", value: "Fast Dispatch", icon: <FiTruck className="w-5 h-5 text-blue-600" /> },
    { label: "Secure Payment", value: "100% Safe", icon: <FiShield className="w-5 h-5 text-emerald-600" /> },
    { label: "Customer Assistance", value: "Direct Support", icon: <FiHeadphones className="w-5 h-5 text-amber-600" /> },
  ];

  const values = [
    {
      title: "Premium Curation",
      desc: "Every single product in our catalog undergoes rigorous quality checks to match your elite standards.",
    },
    {
      title: "Seamless Experience",
      desc: "From smart customer management workflows to lightning-fast logistics, we prioritize your comfort.",
    },
    {
      title: "Legacy of Trust",
      desc: "Built on the pillars of transparency, top-tier integrity, and unparalleled reliability from day one.",
    },
  ];

  return (
    // Perfectly matching your home page background (#fcfdfd)
    <div className="min-h-screen bg-[#fcfdfd] text-gray-800 pt-16 pb-24 relative overflow-hidden font-sans">
      
      {/* Soft, Subtle Pastel Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-200/30 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[400px] h-[400px] bg-blue-200/30 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* --- HERO SECTION --- */}
        <div className="text-center max-w-3xl mx-auto mt-12 mb-20">
          <span className="text-xs font-bold uppercase tracking-widest bg-purple-50 text-purple-700 px-4 py-1.5 rounded-full border border-purple-100 shadow-sm inline-block mb-2">
            Welcome to CRM Traders
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight mt-4 mb-8 leading-tight">
            Elevating Lifestyles <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
              The Modern Way
            </span>
          </h1>
          <p className="text-gray-700 text-base sm:text-xl font-normal leading-relaxed max-w-2xl mx-auto drop-shadow-sm">
            At <span className="text-gray-900 font-bold">CRM Traders</span>, we don't just sell items; we curate micro-experiences. 
            We bridge the gap between high-end product selection and seamless delivery infrastructure.
          </p>
        </div>

        {/* --- BRAND VALUE CARDS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-24">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className="bg-white/80 border border-gray-200/70 backdrop-blur-md rounded-3xl p-6 flex flex-col items-center text-center shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] group hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner border border-gray-100">
                {stat.icon}
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-1 tracking-tight">
                {stat.value}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 font-medium tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* --- CORE VALUES SECTION --- */}
        <div className="border-t border-gray-100 pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-4 sticky top-24">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-4">
                Why Global Shoppers <br />Choose Us
              </h2>
              <p className="text-gray-500 text-sm sm:text-base font-light leading-relaxed">
                Our core operational design ensures excellence at every single touchpoint of your commerce journey.
              </p>
            </div>
            
            <div className="lg:col-span-8 space-y-6">
              {values.map((value, i) => (
                <div 
                  key={i} 
                  className="bg-gradient-to-r from-gray-50/50 to-transparent border-l-2 border-purple-500/30 hover:border-purple-500 p-6 rounded-r-2xl transition-all duration-300 group"
                >
                  <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {value.title}
                  </h4>
                  <p className="text-gray-500 text-sm sm:text-base font-light leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;