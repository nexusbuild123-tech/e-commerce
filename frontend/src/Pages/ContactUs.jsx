import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";

const ContactUs = () => {
  return (
    // Perfectly matching your Home and About page background (#fcfdfd)
    <div className="min-h-screen bg-[#fcfdfd] text-gray-800 pt-16 pb-24 relative overflow-hidden font-sans">
      
      {/* Soft, Subtle Pastel Ambient Glows matching the site design */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-200/30 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[400px] h-[400px] bg-purple-200/30 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* --- HERO SECTION --- */}
        <div className="text-center max-w-3xl mx-auto mt-12 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full border border-blue-100 shadow-sm inline-block mb-2">
            Get In Touch
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight mt-4 mb-6 leading-tight">
            Contact <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">Us</span>
          </h1>
          {/* Enhanced Visibility: Darker color and solid readable weight */}
          <p className="text-gray-700 text-base sm:text-xl font-normal leading-relaxed max-w-xl mx-auto">
            Have questions or need assistance? We are here to help you build a seamless experience.
          </p>
        </div>
        
        {/* --- CONTACT CARDS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          
          {/* Call Card */}
          <div className="bg-white/80 border border-gray-200/70 backdrop-blur-md rounded-3xl p-8 flex flex-col items-center text-center shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] group hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1">
            <span className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-5 group-hover:scale-110 transition-transform shadow-inner border border-purple-100/50">
              <FiPhone className="w-5 h-5" />
            </span>
            <h3 className="text-gray-900 font-bold text-lg mb-2">Call Us</h3>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">Customer Support</p>
            <a href="tel:9899518819" className="text-purple-600 font-semibold hover:text-purple-700 hover:underline transition-colors text-base sm:text-lg">
              9899518819
            </a>
          </div>

          {/* Email Card */}
          <div className="bg-white/80 border border-gray-200/70 backdrop-blur-md rounded-3xl p-8 flex flex-col items-center text-center shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] group hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1">
            <span className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-5 group-hover:scale-110 transition-transform shadow-inner border border-blue-100/50">
              <FiMail className="w-5 h-5" />
            </span>
            <h3 className="text-gray-900 font-bold text-lg mb-2">Email Us</h3>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">Direct Queries</p>
            <a href="mailto:crmtraders25@gmail.com" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors text-base sm:text-lg break-all">
              crmtraders25@gmail.com
            </a>
          </div>

          {/* Location Card */}
          <div className="bg-white/80 border border-gray-200/70 backdrop-blur-md rounded-3xl p-8 flex flex-col items-center text-center shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] group hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1">
            <span className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-5 group-hover:scale-110 transition-transform shadow-inner border border-emerald-100/50">
              <FiMapPin className="w-5 h-5" />
            </span>
            <h3 className="text-gray-900 font-bold text-lg mb-2">Location</h3>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">Headquarters</p>
            <p className="text-gray-800 font-semibold text-base sm:text-lg">
              New Delhi, India
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ContactUs;