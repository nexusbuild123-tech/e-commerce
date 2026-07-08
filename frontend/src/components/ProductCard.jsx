import { useRef } from 'react';
import { Link } from 'react-router-dom';
// React Icons Imports
import { FiArrowRight, FiStar } from 'react-icons/fi';

const ProductCard = ({ product }) => {
  const containerRef = useRef(null);

  if (!product) return null;

  return (
    <div 
      ref={containerRef}
      className="w-full sm:w-[340px] lg:w-[360px] p-3 transition-all duration-500 ease-out"
    >
      {/* Premium Outer Floating Card */}
      <div 
        className="group relative flex flex-col h-[450px] bg-white rounded-[2rem] border border-slate-100/80 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)]"
      >
        
        {/* Subtle Backdrop Ambient Glow on Hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/5 blur-[80px] rounded-full" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/5 blur-[80px] rounded-full" />
        </div>

        {/* 1. Image Studio Frame */}
        <div className="relative h-56 w-full bg-slate-50/70 p-6 flex items-center justify-center overflow-hidden z-10 transition-colors group-hover:bg-slate-50/30">
          <Link 
            to={`/product-types/${product.id}`} 
            className="w-full h-full flex items-center justify-center transform transition-transform duration-500 ease-out group-hover:scale-105"
          >
            <img
              src={product.image || 'https://via.placeholder.com/300x300.png?text=No+Image'}
              alt={product.name}
              className="h-[240px] w-full py-5 group-hover:scale-105 transition-all duration-500"
            />
          </Link>
          
          {/* Discount Tag (Glassmorphic Luxury Pill) */}
          {product.discount && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black tracking-wider px-3 py-1.5 rounded-full shadow-sm uppercase animate-pulse">
              {product.discount}% OFF
            </span>
          )}
          
          {/* Rating Tag */}
          <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md border border-slate-200/40 text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
            <FiStar className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>{product.rating || "4.5"}</span>
          </div>
        </div>

        {/* 2. Meta and Content Container */}
        <div className="p-6 flex flex-col flex-grow z-10 bg-white">
          {/* Category Pill */}
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2 block">
            {product.category || "General"}
          </span>
          
          {/* Product Title */}
          <Link to={`/product-types/${product.id}`} className="block mb-2">
            <h3 className="text-lg font-bold text-slate-900 leading-snug hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]">
              {product.name}
            </h3>
          </Link>
          
          {/* Short Description */}
          <p className="text-xs text-slate-400 font-light line-clamp-3 mb-4 leading-relaxed flex-grow">
            {product.description || "Premium product curated for an unparalleled experience."}
          </p>

          {/* 3. Action Footer Area (Price Removed, Full Width Explore More Button) */}
          <div className="mt-auto pt-2">
            <Link
              to={`/product-types/${product.id}`}
              className="w-full h-12 bg-slate-950 hover:bg-blue-600 text-white text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[0_12px_24px_-6px_rgba(37,99,235,0.4)] group/btn active:scale-98"
            >
              <span>Explore More</span>
              <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;