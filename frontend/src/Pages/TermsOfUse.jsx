// Fixed Import: Replaced non-existent FiShieldAlert with FiAlertTriangle
import { FiFileText, FiAlertTriangle } from "react-icons/fi";

const TermsOfUse = () => {
  return (
    // Perfectly matching your home page background (#fcfdfd)
    <div className="min-h-screen bg-[#fcfdfd] text-gray-800 pt-16 pb-24 relative overflow-hidden font-sans">
      
      {/* Soft, Subtle Pastel Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-100/40 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[400px] h-[400px] bg-purple-200/30 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        
        {/* --- HERO SECTION --- */}
        <div className="text-center mt-12 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest bg-gray-150 text-gray-700 px-4 py-1.5 rounded-full border border-gray-200 shadow-sm inline-block mb-2">
            Legal Agreement
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mt-4 mb-4">
            Terms of <span className="bg-gradient-to-r from-gray-800 via-purple-700 to-blue-600 [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">Use</span>
          </h1>
          <p className="text-gray-600 text-base sm:text-lg font-normal max-w-xl mx-auto">
            Please read these terms carefully before exploring or shopping on CRM Traders.
          </p>
        </div>

        {/* --- TERMS DETAILS CARDS --- */}
        <div className="space-y-6">
          
          {/* User Agreement Card */}
          <div className="bg-white/80 border border-gray-200/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0 border border-blue-100">
              <FiFileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">Acceptance of Terms</h3>
              <p className="text-gray-600 font-normal leading-relaxed text-sm sm:text-base">
                By browsing, accessing, or interacting with the network servers of <span className="text-gray-900 font-bold">CRM Traders</span>, you explicitly bind agreement to conform with our listed commercial policies and legal compliance rules.
              </p>
            </div>
          </div>

          {/* Intellectual Property Card */}
          <div className="bg-white/80 border border-gray-200/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-5 items-start">
            {/* Updated Icon Container */}
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0 border border-purple-100">
              <FiAlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">Intellectual Property & Copyright</h3>
              <p className="text-gray-600 font-normal leading-relaxed text-sm sm:text-base">
                Any reproduction of source layouts, graphic styling, design wireframes, or product distribution tokens from this application without digital authorization is strictly prohibited and subject to legal copyright remediation.
              </p>
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