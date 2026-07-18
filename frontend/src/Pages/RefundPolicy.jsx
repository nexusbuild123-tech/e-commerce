import { useEffect } from "react";
// Added FiMail, FiPhone, FiMapPin for the contact section
import { FiRefreshCw, FiShield, FiTruck, FiClock, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { Link } from "react-router-dom";

const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfdfd] text-gray-800 pt-16 pb-24 relative overflow-hidden font-sans">
      
      {/* Soft, Subtle Pastel Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-100/40 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[400px] h-[400px] bg-blue-200/30 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        
        {/* --- HERO SECTION --- */}
        <div className="text-center mt-12 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full border border-emerald-100 shadow-sm inline-block mb-2">
            Trust & Safety
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mt-4 mb-4">
            Refund <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">Policy</span>
          </h1>
          <p className="text-gray-600 text-base sm:text-lg font-normal max-w-xl mx-auto">
            At CRM TRADERS, your satisfaction is our priority. Here is how our 100% transparent return and refund process works.
          </p>
        </div>

        {/* --- POLICY DETAILS CARDS --- */}
        <div className="space-y-6">
          
          {/* 1. Return Window & Eligibility Card */}
          <div className="bg-white/80 border border-gray-200/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0 border border-emerald-100">
              <FiRefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">7-Day Return Window & Eligibility</h3>
              <p className="text-gray-600 font-normal leading-relaxed text-sm sm:text-base mb-3">
                You can request a return within <span className="text-emerald-600 font-semibold">7 days from the date of delivery</span> if you face any of the following issues:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 font-medium mb-4">
                <li className="flex items-center gap-2">🔹 Product received is damaged</li>
                <li className="flex items-center gap-2">🔹 Product is defective</li>
                <li className="flex items-center gap-2">🔹 Received the wrong product</li>
                <li className="flex items-center gap-2">🔹 Not satisfied with the product</li>
              </ul>
              <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <strong className="text-gray-700">Condition:</strong> The product must be unused, undamaged, unaltered, and in its original packaging with all accessories. For damaged, defective, or incorrect items, you may be required to share photographs or videos as proof.
              </p>
            </div>
          </div>

          {/* 2. Return Shipping Card */}
          <div className="bg-white/80 border border-gray-200/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 flex-shrink-0 border border-teal-100">
              <FiTruck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">Free Return Shipping</h3>
              <p className="text-gray-600 font-normal leading-relaxed text-sm sm:text-base">
                <span className="font-semibold text-gray-900">CRM TRADERS will bear the applicable return shipping cost</span> for all eligible returns accepted under this policy. Please contact our support team before shipping anything back; detailed return instructions will be provided once your request is approved.
              </p>
            </div>
          </div>

          {/* 3. Refund Process & Timeline Card */}
          <div className="bg-white/80 border border-gray-200/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0 border border-blue-100">
              <FiClock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">Refund Processing & Timeline</h3>
              <p className="text-gray-600 font-normal leading-relaxed text-sm sm:text-base">
                Once your returned product is received and successfully inspected by our team, the refund will be initiated. The amount will be credited <span className="text-blue-600 font-semibold">within approximately 15 days</span> via an appropriate available refund method.
              </p>
            </div>
          </div>

          {/* 4. Contact Details Card (NEW) */}
          <div className="bg-white/80 border border-gray-200/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0 border border-indigo-100">
              <FiMail className="w-6 h-6" />
            </div>
            <div className="w-full">
              <h3 className="text-gray-900 font-bold text-lg mb-2">Official Contact & Support Desk</h3>
              <p className="text-gray-600 text-sm sm:text-base mb-4 leading-relaxed">
                For any return or refund requests, please get in touch with <span className="font-semibold text-gray-900">CRM TRADERS</span> through any of the official channels below:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm sm:text-base">
                {/* Address Info */}
                <div className="flex gap-3 items-start bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <FiMapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Store Address</span>
                    <p className="text-gray-800 font-medium">CRM TRADERS</p>
                    <p className="text-gray-600 text-sm">Shyampur, Ramnagar - 721423</p>
                  </div>
                </div>

                {/* Direct Communications */}
                <div className="space-y-3">
                  {/* Email */}
                  <a href="mailto:crmtraders25@gmail.com" className="flex gap-3 items-center bg-gray-50/50 p-3.5 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all group">
                    <FiMail className="w-5 h-5 text-gray-500 group-hover:text-indigo-600 transition-colors" />
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Us</span>
                      <span className="text-gray-700 font-medium group-hover:text-indigo-700 text-sm sm:text-base">crmtraders25@gmail.com</span>
                    </div>
                  </a>
                  {/* Phone */}
                  <a href="tel:9899518819" className="flex gap-3 items-center bg-gray-50/50 p-3.5 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all group">
                    <FiPhone className="w-5 h-5 text-gray-500 group-hover:text-indigo-600 transition-colors" />
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Call Us</span>
                      <span className="text-gray-700 font-medium group-hover:text-indigo-700 text-sm sm:text-base">+91 9899518819</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Guarantee Footer Note */}
          <div className="bg-gradient-to-r from-emerald-50/50 via-blue-50/30 to-transparent border border-emerald-100/70 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mt-8">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/20">
                <FiShield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-gray-900 font-bold text-base">Questions about your return?</h4>
                <p className="text-gray-500 text-sm font-normal mt-0.5">Our support desk is always ready to guide you.</p>
              </div>
            </div>
            <Link 
              to="/contact-us" 
              className="w-full sm:w-auto text-center bg-gray-900 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-98 text-sm"
            >
              Raise a Claim
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default RefundPolicy;