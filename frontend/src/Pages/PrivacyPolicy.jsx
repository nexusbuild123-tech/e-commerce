import { useEffect } from "react";
// Fix: Removed unused 'Link' import to resolve ESLint warning
import { useLocation } from "react-router-dom";
// Fix: Removed unused 'FiLock' and 'FiDatabase' imports to clean the build
import { 
  FiUser, 
  FiEye, 
  FiShare2, 
  FiShield, 
  FiSliders, 
  FiMail, 
  FiPhone, 
  FiMapPin 
} from "react-icons/fi";

const PrivacyPolicy = () => {
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

  return (
    // Perfectly matching your home page background (#fcfdfd)
    <div className="min-h-screen bg-[#fcfdfd] text-gray-800 pt-16 pb-24 relative overflow-hidden font-sans">
      
      {/* Soft, Subtle Pastel Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-100/40 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[400px] h-[400px] bg-purple-200/30 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        
        {/* --- HERO SECTION --- */}
        <div className="text-center mt-12 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full border border-blue-100 shadow-sm inline-block mb-2">
            Data Protection
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mt-4 mb-4">
            Privacy <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">Policy</span>
          </h1>
          <p className="text-gray-600 text-base sm:text-lg font-normal max-w-xl mx-auto">
            CRM TRADERS respects your privacy and is committed to handling your personal information responsibly.
          </p>
        </div>

        {/* --- PRIVACY DETAILS CARDS --- */}
        <div className="space-y-6">
          
          {/* 1. Information We Collect */}
          <div className="bg-white/80 border border-gray-200/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0 border border-blue-100">
              <FiUser className="w-6 h-6" />
            </div>
            <div className="w-full">
              <h3 className="text-gray-900 font-bold text-lg mb-2">Information We Collect</h3>
              <p className="text-gray-600 font-normal leading-relaxed text-sm sm:text-base mb-4">
                We may collect the following personal information to serve you better:
              </p>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100 text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Name
                </div>
                <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100 text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Mobile Number
                </div>
                <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100 text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Delivery Address
                </div>
                <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100 text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Email Address
                </div>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                We may also automatically collect limited technical information necessary for website operation, security, and performance, depending on the technologies used by our website.
              </p>
            </div>
          </div>

          {/* 2. How We Use Your Information */}
          <div className="bg-white/80 border border-gray-200/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0 border border-purple-100">
              <FiEye className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">How We Use Your Information</h3>
              <p className="text-gray-600 font-normal leading-relaxed text-sm sm:text-base mb-3">
                We may use your personal information to:
              </p>
              <ul className="space-y-2.5 text-sm text-gray-600 font-normal ml-1">
                <li className="flex items-start gap-2">• Process and manage your product orders seamlessly.</li>
                <li className="flex items-start gap-2">• Deliver products safely to your provided physical address.</li>
                <li className="flex items-start gap-2">• Contact you regarding your orders, returns, refunds, or support requests.</li>
                <li className="flex items-start gap-2">• Verify Cash on Delivery (COD) orders where strictly necessary.</li>
                <li className="flex items-start gap-2">• Prevent fraud and protect the absolute security of our digital services.</li>
                <li className="flex items-start gap-2">• Comply with applicable legal and regulatory frameworks.</li>
              </ul>
            </div>
          </div>

          {/* 3. Sharing of Information */}
          <div className="bg-white/80 border border-gray-200/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0 border border-amber-100">
              <FiShare2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">Sharing of Information</h3>
              <p className="text-gray-600 font-normal leading-relaxed text-sm sm:text-base mb-3">
                We may share necessary information with trusted service providers, such as courier and logistics partners, when required to process and deliver your orders. We may also disclose information when required by applicable law, legal process, or government authorities.
              </p>
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-xs text-rose-800 font-medium">
                🔒 We strictly do NOT sell or rent your personal information to third parties for their independent marketing purposes.
              </div>
            </div>
          </div>

          {/* 4. Data Security & Retention */}
          <div className="bg-white/80 border border-gray-200/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0 border border-green-100">
              <FiShield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">Data Security & Retention</h3>
              <p className="text-gray-600 font-normal leading-relaxed text-sm sm:text-base mb-3">
                We take reasonable measures to protect personal information from unauthorized access, misuse, loss, or disclosure. However, no online system or method of electronic transmission can be guaranteed to be completely secure.
              </p>
              <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <strong>Retention Policy:</strong> We retain personal data for as long as necessary to fulfill the purposes described in this policy, maintain business/transaction records, resolve disputes, and comply with law.
              </p>
            </div>
          </div>

          {/* 5. Rights & Cookies */}
          <div className="bg-white/80 border border-gray-200/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0 border border-indigo-100">
              <FiSliders className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">Your Choices, Rights & Cookies</h3>
              <p className="text-gray-600 font-normal leading-relaxed text-sm sm:text-base mb-3">
                Depending on applicable law, you may contact us to request access to, correction of, or deletion of your personal information, subject to legal and legitimate business retention requirements.
              </p>
              <p className="text-gray-600 font-normal leading-relaxed text-sm sm:text-base">
                Our platform uses cookies or similar technologies that are necessary for website functionality, security, analytics, or improving the user experience.
              </p>
            </div>
          </div>

          {/* 6. Contact Us Desk */}
          <div className="bg-white/80 border border-gray-200/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0 border border-purple-100">
              <FiMail className="w-6 h-6" />
            </div>
            <div className="w-full">
              <h3 className="text-gray-900 font-bold text-lg mb-2">Privacy Helpdesk & Updates</h3>
              <p className="text-gray-600 text-sm sm:text-base mb-4 leading-relaxed">
                We may update this Privacy Policy from time to time. For any serious questions or concerns regarding your personal information, please reach out to us:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                {/* Email Option */}
                <a href="mailto:crmtraders25@gmail.com" className="flex gap-3 items-center bg-gray-50/50 p-3.5 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/20 transition-all group">
                  <FiMail className="w-5 h-5 text-gray-500 group-hover:text-purple-600 transition-colors" />
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Us</span>
                    <span className="text-gray-700 font-medium group-hover:text-purple-700 text-xs sm:text-sm">crmtraders25@gmail.com</span>
                  </div>
                </a>
                
                {/* Phone Option */}
                <a href="tel:9899518819" className="flex gap-3 items-center bg-gray-50/50 p-3.5 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/20 transition-all group">
                  <FiPhone className="w-5 h-5 text-gray-500 group-hover:text-purple-600 transition-colors" />
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Call Us</span>
                    <span className="text-gray-700 font-medium group-hover:text-purple-700 text-sm">9899518819</span>
                  </div>
                </a>
              </div>

              {/* Physical Address */}
              <div className="flex gap-3 items-center bg-gray-50/30 p-3 rounded-xl border border-gray-100 text-xs sm:text-sm text-gray-600">
                <FiMapPin className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span><strong>Address:</strong> CRM TRADERS, Shyampur, Ramnagar - 721423</span>
              </div>
            </div>
          </div>

        </div>

        {/* --- FOOTER NOTICE --- */}
        <p className="text-center text-xs text-gray-400 mt-12 font-medium tracking-wide">
          © {new Date().getFullYear()} CRM Traders. All Rights Reserved.
        </p>

      </div>
    </div>
  );
};

export default PrivacyPolicy;