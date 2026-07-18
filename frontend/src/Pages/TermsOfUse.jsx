import { useEffect } from "react";
// Fix: Imported useLocation and Link for flawless page tracking and routing
import { Link, useLocation } from "react-router-dom";
// Fix: Imported precise icons for all terms sections
import { 
  FiFileText, 
  FiShoppingBag, 
  FiCheckCircle, 
  FiCreditCard, 
  FiTruck, 
  FiRefreshCw, 
  FiSlash, 
  FiShield, 
  FiMail, 
  FiPhone, 
  FiMapPin 
} from "react-icons/fi";

const TermsOfUse = () => {
  const { pathname } = useLocation();

  // 100% Bulletproof Scroll to Top Fix (Just like Refund/Cancellation pages)
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
          <span className="text-xs font-bold uppercase tracking-widest bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full border border-gray-200 shadow-sm inline-block mb-2">
            Legal Agreement
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mt-4 mb-4">
            Terms of <span className="bg-gradient-to-r from-gray-800 via-purple-700 to-blue-600 [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">Use</span>
          </h1>
          <p className="text-gray-600 text-base sm:text-lg font-normal max-w-xl mx-auto">
            Welcome to crmtraders.com. Please read these terms carefully before accessing our website or purchasing our products.
          </p>
        </div>

        {/* --- TERMS DETAILS CARDS --- */}
        <div className="space-y-6">
          
          {/* 1. Acceptance of Terms */}
          <div className="bg-white/80 border border-gray-200/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0 border border-blue-100">
              <FiFileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">Acceptance of Terms</h3>
              <p className="text-gray-600 font-normal leading-relaxed text-sm sm:text-base">
                By accessing or using our website and purchasing products from us, you agree to comply with and be bound by these Terms of Use. If you do not agree, please refrain from using the platform.
              </p>
            </div>
          </div>

          {/* 2. Products & Handmade Nature */}
          <div className="bg-white/80 border border-gray-200/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0 border border-amber-100">
              <FiShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">Product Information & Handmade Variations</h3>
              <p className="text-gray-600 font-normal leading-relaxed text-sm sm:text-base mb-3">
                CRM TRADERS offers unique handmade products, including home, garden, and kitchen items. As these are artisanal goods, minor variations in color, size, shape, texture, finish, or overall appearance may occur. 
              </p>
              <p className="text-gray-600 font-normal leading-relaxed text-sm sm:text-base">
                Such variations are a natural characteristic of craftsmanship and are <span className="font-semibold text-gray-900">not considered defects</span>. Please note that product colors might also vary slightly depending on photography lighting and device screen settings.
              </p>
            </div>
          </div>

          {/* 3. Orders & Cancellation Rights */}
          <div className="bg-white/80 border border-gray-200/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0 border border-green-100">
              <FiCheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">Order Acceptance & Verification</h3>
              <p className="text-gray-600 font-normal leading-relaxed text-sm sm:text-base">
                All placed orders are subject to stock availability and successful order verification. CRM TRADERS reserves the absolute right to accept, reject, or cancel any order at any stage due to stock issues, pricing errors, incorrect information, suspected fraudulent activity, or unexpected logistics limitations.
              </p>
            </div>
          </div>

          {/* 4. Payment Terms */}
          <div className="bg-white/80 border border-gray-200/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0 border border-purple-100">
              <FiCreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">Payment Methods & Customer Duty</h3>
              <p className="text-gray-600 font-normal leading-relaxed text-sm sm:text-base">
                We currently offer <span className="font-semibold text-purple-600">Cash on Delivery (COD)</span>, subject to courier serviceability at your specific location. Customers are strictly responsible for providing a 100% accurate name, active mobile number, valid email, and detailed delivery address during checkout.
              </p>
            </div>
          </div>

          {/* 5. Shipping & Deliveries */}
          <div className="bg-white/80 border border-gray-200/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0 border border-indigo-100">
              <FiTruck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">Shipping Timelines</h3>
              <p className="text-gray-600 font-normal leading-relaxed text-sm sm:text-base">
                We make every reasonable effort to dispatch and deliver your parcels within the estimated timeframe. However, final delivery schedules may vary or get delayed due to external circumstances like courier backlogs, severe weather conditions, public holidays, remote terrain issues, or other factors outside our control.
              </p>
            </div>
          </div>

          {/* 6. Returns, Refunds & Cancellations */}
          <div className="bg-white/80 border border-gray-200/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 flex-shrink-0 border border-rose-100">
              <FiRefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">Returns, Refunds & Cancellations</h3>
              <p className="text-gray-600 font-normal leading-relaxed text-sm sm:text-base">
                All structural product returns, payment refunds, and initial order cancellation requests are strictly handled in accordance with our dedicated <Link to="/refund-policy" className="text-purple-600 underline font-medium hover:text-purple-700">Return & Refund Policy</Link> and <Link to="/cancellation" className="text-purple-600 underline font-medium hover:text-purple-700">Cancellation Policy</Link>.
              </p>
            </div>
          </div>

          {/* 7. Website Usage Rules */}
          <div className="bg-white/80 border border-gray-200/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 flex-shrink-0 border border-red-100">
              <FiSlash className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">Prohibited Website Use</h3>
              <p className="text-gray-600 font-normal leading-relaxed text-sm sm:text-base">
                Users must not misuse this platform. Attempting unauthorized server access, interfering with core backend operations, submitting intentionally false user information, or exploiting the layout for fraudulent or unlawful purposes will lead to immediate service termination and legal actions.
              </p>
            </div>
          </div>

          {/* 8. Intellectual Property & Liability */}
          <div className="bg-white/80 border border-gray-200/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-700 flex-shrink-0 border border-gray-200">
              <FiShield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">Intellectual Property & Liability Limits</h3>
              <p className="text-gray-600 font-normal leading-relaxed text-sm sm:text-base mb-3">
                Unless stated explicitly, all digital content on crmtraders.com—including written text, layouts, graphics, brand logos, product photographs, and original media assets—belongs entirely to <span className="font-semibold text-gray-900">CRM TRADERS</span> and cannot be copied or exploited commercially without authorization.
              </p>
              <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <strong className="text-gray-700">Liability Limitation:</strong> To the extent permitted by law, CRM TRADERS is not liable for any indirect or consequential losses arising from the use of this website or our sold items.
              </p>
            </div>
          </div>

          {/* 9. Contact Us Desk */}
          <div className="bg-white/80 border border-gray-200/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0 border border-purple-100">
              <FiMail className="w-6 h-6" />
            </div>
            <div className="w-full">
              <h3 className="text-gray-900 font-bold text-lg mb-2">Legal Helpdesk & Changes</h3>
              <p className="text-gray-600 text-sm sm:text-base mb-4 leading-relaxed">
                CRM TRADERS may update these Terms of Use from time to time. If you have any serious questions regarding our commercial rules, please reach out to us:
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

export default TermsOfUse;