import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const FAQ = () => {
  // Updated text to accurately reflect Cash on Delivery (COD) and manual tracking
  const faqs = [
    { 
      q: "How do I track my order?", 
      a: "Once your order is confirmed, our team dispatches it quickly. You can check your order status anytime on our 'Track Order' page using your registered Mobile Number, or directly reach out to our support." 
    },
    { 
      q: "What are the shipping charges?", 
      a: "We offer complimentary premium shipping across our catalog. Standard delivery usually takes 3-5 business days depending on your location." 
    },
    { 
      q: "What payment methods do you support?", 
      a: "To ensure maximum trust and security, we currently operate exclusively on Cash on Delivery (COD). You only pay when the product safely reaches your doorstep." 
    }
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#fcfdfd] text-gray-800 pt-16 pb-24 relative overflow-hidden font-sans">
      
      {/* Soft, Subtle Pastel Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-200/30 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[400px] h-[400px] bg-blue-200/30 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        
        {/* --- HERO SECTION --- */}
        <div className="text-center mt-12 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest bg-purple-50 text-purple-700 px-4 py-1.5 rounded-full border border-purple-100 shadow-sm inline-block mb-2">
            Help Center
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mt-4 mb-4">
            Frequently Asked <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">Questions</span>
          </h1>
          <p className="text-gray-600 text-base sm:text-lg font-normal">
            Quick answers to the questions you might have about our services.
          </p>
        </div>

        {/* --- ACCORDION FAQ LIST --- */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className="bg-white/80 border border-gray-200/70 backdrop-blur-md rounded-2xl overflow-hidden shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] transition-all duration-300"
              >
                {/* Question Trigger Button */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left px-6 py-5 flex justify-between items-center gap-4 transition-colors hover:bg-gray-50/50"
                >
                  <span className={`font-bold text-base sm:text-lg transition-colors duration-300 ${isOpen ? "text-purple-600" : "text-gray-900"}`}>
                    {faq.q}
                  </span>
                  <FiChevronDown 
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-purple-600" : ""}`} 
                  />
                </button>

                {/* Animated Answer Panel */}
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-40 border-t border-gray-100/70" : "max-h-0"}`}
                >
                  <div className="p-6 bg-gradient-to-r from-gray-50/30 to-transparent">
                    <p className="text-gray-600 font-normal leading-relaxed text-sm sm:text-base">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default FAQ;