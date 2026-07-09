import { FiRefreshCw, FiCheckCircle, FiShield } from "react-icons/fi";
import { Link } from "react-router-dom";

const RefundPolicy = () => {
  return (
    // Perfectly matching your home page background (#fcfdfd)
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
            Your satisfaction is our priority. Here is how our 100% transparent refund process works.
          </p>
        </div>

        {/* --- POLICY DETAILS CARDS --- */}
        <div className="space-y-6">
          
          {/* 7-Day Window Card */}
          <div className="bg-white/80 border border-gray-200/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0 border border-emerald-100">
              <FiRefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">7-Day Hassle-Free Returns</h3>
              <p className="text-gray-600 font-normal leading-relaxed text-sm sm:text-base">
                We offer a strict <span className="text-emerald-600 font-semibold">7-day return cycle</span>. If the product arrives physically damaged, defective, or does not match the description on our store, you can initiate a return claim instantly.
              </p>
            </div>
          </div>

          {/* COD Refund Process Card */}
          <div className="bg-white/80 border border-gray-200/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0 border border-blue-100">
              <FiCheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">Cash on Delivery (COD) Refunds</h3>
              <p className="text-gray-600 font-normal leading-relaxed text-sm sm:text-base">
                Since all payments are collected via Cash on Delivery, approved return requests will be refunded directly via <span className="text-gray-900 font-semibold">UPI (GPay/PhonePe/Paytm)</span> or <span className="text-gray-900 font-semibold">Direct Bank Transfer (NEFT)</span> within 5 to 7 operational business days after the product is picked up.
              </p>
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