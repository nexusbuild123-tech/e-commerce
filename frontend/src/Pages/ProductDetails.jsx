import { useState } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  // useParams() se dynamic Variant ID read ho rahi hai
  const { id } = useParams();

  // Color variants logic
  const colors = [
    { name: "Midnight Black", hex: "#1f2937", image: "https://via.placeholder.com/600x500/1f2937/ffffff?text=Black+Model" },
    { name: "Pearl White", hex: "#f9fafb", image: "https://via.placeholder.com/600x500/f9fafb/000000?text=White+Model" },
    { name: "Ocean Blue", hex: "#0369a1", image: "https://via.placeholder.com/600x500/0369a1/ffffff?text=Blue+Model" },
  ];

  const [selectedColor, setSelectedColor] = useState(colors[0]);

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Left Side: Product Image Viewer */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="bg-gray-50 rounded-3xl overflow-hidden p-8 flex items-center justify-center border border-gray-100 shadow-inner">
              <img 
                src={selectedColor.image} 
                alt="Product" 
                className="w-full h-auto object-contain max-h-[500px] transition-all duration-500"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="flex gap-4 mt-6">
              {[1, 2, 3, 4].map((thumb) => (
                <button key={thumb} className="w-20 h-20 rounded-xl bg-gray-50 border-2 border-transparent hover:border-gray-900 overflow-hidden">
                  <img src={selectedColor.image} alt={`view-${thumb}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Side: Product Details & Actions */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Premium Variant</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500 text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">ID: {id}</span>
            </div>

            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
              Sony Noise Cancelling Wireless Headphones
            </h1>
            
            <p className="text-gray-500 text-lg mb-8 leading-relaxed">
              Experience the next level of silence. These headphones adapt to your environment, delivering pure, uninterrupted audio quality with an ergonomic design built for all-day comfort.
            </p>

            <div className="text-3xl font-black text-gray-900 mb-8">
              ₹24,990 <span className="text-lg text-gray-400 line-through ml-3 font-medium">₹29,990</span>
            </div>

            {/* COLOR SELECTOR */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                Color: <span className="text-gray-500 font-medium normal-case">{selectedColor.name}</span>
              </h3>
              <div className="flex gap-4">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={`w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                      selectedColor.name === color.name 
                        ? 'border-blue-600 scale-110 shadow-lg' 
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ 
                      backgroundColor: color.hex, 
                      outline: selectedColor.name === color.name ? '2px solid white' : 'none', 
                      outlineOffset: '-4px' 
                    }}
                    aria-label={`Select ${color.name}`}
                  />
                ))}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button className="flex-1 bg-gray-900 text-white hover:bg-gray-800 text-lg font-bold py-4 px-8 rounded-xl shadow-xl shadow-gray-900/20 transition-all transform hover:-translate-y-1">
                Add to Cart
              </button>
              <button className="flex-1 bg-blue-600 text-white hover:bg-blue-700 text-lg font-bold py-4 px-8 rounded-xl shadow-xl shadow-blue-600/20 transition-all transform hover:-translate-y-1">
                Buy Now
              </button>
            </div>

            {/* Extra Benefits */}
            <div className="mt-10 grid grid-cols-2 gap-4 border-t border-gray-100 pt-8">
              <div className="flex items-center gap-3 text-gray-600 text-sm font-medium">
                <span className="text-xl">🚚</span> Free Fast Delivery
              </div>
              <div className="flex items-center gap-3 text-gray-600 text-sm font-medium">
                <span className="text-xl">🛡️</span> 1 Year Warranty
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;