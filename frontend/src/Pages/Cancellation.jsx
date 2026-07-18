import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
// Fix: Replaced 'FiShieldAlert' with 'FiAlertTriangle' to resolve the import error
import { FiClock, FiAlertCircle, FiCreditCard, FiMail, FiPhone, FiAlertTriangle } from "react-icons/fi";

const Cancellation = () => {
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
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-100/40 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[400px] h-[400px] bg-purple-200/30 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        
        {/* --- HERO SECTION --- */}
        <div className="text-center mt-12 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest bg-red-50 text-red-600 px-4 py-1.5 rounded-full border border-red-100 shadow-sm inline-block mb-2">
            Our Policies
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mt-4 mb-4">
            Cancellation <span className="bg-gradient-to-r from-red-500 via-purple-600 to-blue-600 [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">Policy</span>
          </h1>
          <p className="text-gray-600 text-base sm:text-lg font-normal max-w-xl mx-auto">
            We understand plans change. Here is how you can manage or cancel your order with CRM TRADERS seamlessly.
          </p>
        </div>

        {/* --- POLICY DETAILS CARDS --- */}
        <div className="space-y-6">
          
          {/* 1. Before Shipment Rule Card */}
          <div className="bg-white/80 border border-gray-200/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0 border border-purple-100">
              <FiClock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">Cancellation Before Shipment</h3>
              <p className="text-gray-600 font-normal leading-relaxed text-sm sm:text-base mb-3">
                Customers may request the cancellation of an order <span className="text-purple-600 font-semibold">before it has been shipped or dispatched</span>. To raise a request, please contact us as soon as possible with your correct order details.
              </p>
              <div className="flex gap-2 items-center text-xs text-amber-700 bg-amber-50 border border-amber-100 p-3 rounded-xl">
                <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>कृपया ध्यान दें: आर्डर कैंसिल करने के लिए तुरंत आर्डर डिटेल्स के साथ संपर्क करें।</span>
              </div>
            </div>
          </div>

          {/* 2. Post-Dispatch Notice Card */}
          <div className="bg-white/80 border border-gray-200/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500 flex-shrink-0 border border-red-100">
              <FiAlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">Post-Dispatch Policy</h3>
              <p className="text-gray-600 font-normal leading-relaxed text-sm sm:text-base">
                Once an order has been shipped or dispatched, <span className="text-red-600 font-semibold">it cannot be cancelled</span> under any circumstances. However, you can still request a return after receiving the product in accordance with our <Link to="/refund-policy" className="text-purple-600 underline font-medium hover:text-purple-700">Return & Refund Policy</Link>.
              </p>
            </div>
          </div>

          {/* 3. Prepaid Refunds & Rights Card */}
          <div className="bg-white/80 border border-gray-200/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0 border border-blue-100">
              <FiCreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">Prepaid Refunds & Store Rights</h3>
              <p className="text-gray-600 font-normal leading-relaxed text-sm sm:text-base mb-3">
                If an eligible prepaid order is successfully cancelled before shipment, the applicable refund will be automatically processed through the available refund method.
              </p>
              <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <strong className="text-gray-700">CRM TRADERS Rights:</strong> We reserve the right to cancel any order due to product unavailability, incorrect pricing, payment issues, suspected fraudulent activity, delivery restrictions, or other unavoidable circumstances. In such cases, full refunds for any payments received will be issued.
              </p>
            </div>
          </div>

          {/* 4. Contact Details Card */}
          <div className="bg-white/80 border border-gray-200/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0 border border-purple-100">
              <FiMail className="w-6 h-6" />
            </div>
            <div className="w-full">
              <h3 className="text-gray-900 font-bold text-lg mb-2">Cancellation Helpdesk</h3>
              <p className="text-gray-600 text-sm sm:text-base mb-4 leading-relaxed">
                For any cancellation-related queries or urgent requests, please reach out to <span className="font-semibold text-gray-900">CRM TRADERS</span> immediately:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
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
            </div>
          </div>

          {/* Guarantee Footer Note */}
          <div className="bg-gradient-to-r from-purple-50/50 via-blue-50/30 to-transparent border border-purple-100/70 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mt-8">
            <div className="flex gap-4 items-start">
              {/* Fix: Replaced FiShieldAlert with FiAlertTriangle here */}
              <div className="w-10 h-10 rounded-lg bg-red-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-red-500/20">
                <FiAlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-gray-900 font-bold text-base">Need an urgent cancellation?</h4>
                <p className="text-gray-500 text-sm font-normal mt-0.5">Get in touch with our helpdesk team directly.</p>
              </div>
            </div>
            <Link 
              to="/contact-us" 
              className="w-full sm:w-auto text-center bg-gray-900 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-98 text-sm"
            >
              Contact Helpdesk
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Cancellation;