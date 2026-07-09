import { FiClock, FiAlertCircle, FiPhoneCall } from "react-icons/fi";
import { Link } from "react-router-dom";

const Cancellation = () => {
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
            We understand plans change. Here is how you can manage or cancel your order with us seamlessly.
          </p>
        </div>

        {/* --- POLICY DETAILS CARDS --- */}
        <div className="space-y-6">
          
          {/* Main Timeframe Rule Card */}
          <div className="bg-white/80 border border-gray-200/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0 border border-purple-100">
              <FiClock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">2-Hour Cancellation Window</h3>
              <p className="text-gray-600 font-normal leading-relaxed text-sm sm:text-base">
                Orders can be cancelled seamlessly within <span className="text-purple-600 font-semibold">2 hours</span> of placing them. Since we operate on Cash on Delivery, this helps us avoid dispatching items that are no longer needed.
              </p>
            </div>
          </div>

          {/* After Dispatch Notice Card */}
          <div className="bg-white/80 border border-gray-200/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500 flex-shrink-0 border border-red-100">
              <FiAlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">Post-Dispatch Information</h3>
              <p className="text-gray-600 font-normal leading-relaxed text-sm sm:text-base">
                Once the order moves into the shipping stream or is handed over to our delivery partners, manual cancellations from the website cannot be done.
              </p>
            </div>
          </div>

          {/* Urgent Help Section */}
          <div className="bg-gradient-to-r from-purple-50/50 via-blue-50/30 to-transparent border border-purple-100/70 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mt-8">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-blue-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20">
                <FiPhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-gray-900 font-bold text-base">Need an urgent cancellation?</h4>
                <p className="text-gray-500 text-sm font-normal mt-0.5">Get in touch with our helpdesk team directly.</p>
              </div>
            </div>
            <Link 
              to="/contact-us" 
              className="w-full sm:w-auto text-center bg-gray-900 hover:bg-purple-650 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-98 text-sm"
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