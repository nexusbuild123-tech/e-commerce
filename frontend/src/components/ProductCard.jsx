import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 relative flex flex-col h-full">
      
      {/* Optional Discount Badge */}
      {product.discount && (
        <div className="absolute top-3 left-3 z-10 bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
          {product.discount}% OFF
        </div>
      )}

      {/* Image Container with Hover Zoom */}
      {/* FIXED: PURANE PATH KO /product-types ME BADLA */}
      <Link to={`/product-types/${product.id}`} className="relative h-60 w-full overflow-hidden bg-gray-50 flex items-center justify-center p-4">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        {/* Quick View Overlay (Shows on Hover) */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-white/90 backdrop-blur-md text-gray-900 font-semibold px-6 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            View Variants
          </span>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{product.category}</span>
          <span className="flex items-center text-xs text-amber-500 font-bold bg-amber-50 px-2 py-1 rounded-md">
            ★ {product.rating || "4.5"}
          </span>
        </div>
        
        {/* FIXED: PURANE PATH KO /product-types ME BADLA */}
        <Link to={`/product-types/${product.id}`}>
          <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-500 text-sm mt-2 line-clamp-2 mb-4 flex-grow">
          {product.description}
        </p>
        
        {/* MODIFIED: Removed Price & Added Premium "Explore Now" Button */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          {/* FIXED: PURANE PATH KO /product-types ME BADLA */}
          <Link 
            to={`/product-types/${product.id}`}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span>Explore Now</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;