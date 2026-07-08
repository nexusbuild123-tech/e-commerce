import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useRefresh } from '../context/RefreshContext';
import Footer from "../Pages/Footer"

const apiUrl = import.meta.env.VITE_API_URL;

const Home = () => {
  const categoryScrollRef = useRef(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [dbBanners, setDbBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const { refreshKey } = useRefresh();

  const fetchBanners = async () => {
    try {
      const response = await fetch(`${apiUrl}/banners?t=${Date.now()}`, { cache: "no-store" });
      const data = await response.json();
      if (data.status === "success" && data.banners.length > 0) {
        setDbBanners(data.banners);
      }
    } catch (error) {
      console.error("Failed to load banners", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${apiUrl}/categories?t=${Date.now()}`, { cache: "no-store" });
      const data = await response.json();
      if (data.status === "success") {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Failed to load categories", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${apiUrl}/product-cards?t=${Date.now()}`, { cache: "no-store" });
      const data = await response.json();
      if (data.status === "success") {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Failed to load products", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBanners();
    fetchCategories();
    fetchProducts();
  }, [refreshKey]);

  const activeBanners = dbBanners;
  useEffect(() => {
    if (activeBanners.length === 0) return;
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === activeBanners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [activeBanners.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev === activeBanners.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? activeBanners.length - 1 : prev - 1));

  return (
    <>
      {/* --- Self-contained Modern Aesthetic Animations --- */}
      <style>{`
        @keyframes fadeUpStagger {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatSmooth {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-fade-up {
          animation: fadeUpStagger 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          opacity: 0;
        }
        .animate-float {
          animation: floatSmooth 5s ease-in-out infinite;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.08);
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .text-gradient {
          background: linear-gradient(135deg, #2563eb, #9333ea, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .footer-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 1px;
          bottom: 0;
          left: 0;
          background-color: #a855f7;
          transition: width 0.3s ease-in-out;
        }
        .footer-link:hover::after {
          width: 100%;
        }
      `}</style>

      <div className="bg-[#fcfdfd] min-h-screen flex flex-col overflow-x-hidden font-sans text-gray-900">

        {/* --- HERO SLIDER --- */}
        <div className="relative w-full mx-auto mb-10 sm:mb-16">
          <div className="relative h-[300px] sm:h-[450px] lg:h-[600px] w-full overflow-hidden shadow-2xl rounded-b-[2.5rem] lg:rounded-none group">
            <div className="flex w-full h-full transition-transform duration-[1200ms] cubic-bezier(0.7, 0, 0.3, 1)" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {activeBanners.map((banner) => (
                <div key={banner.id} className="min-w-full h-full relative flex items-center justify-center overflow-hidden">
                  <img src={banner.image_data} alt={banner.filename} className="w-full h-full object-cover transform scale-105 transition-transform duration-[15s] ease-out hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/60 via-transparent to-transparent" />
                </div>
              ))}
            </div>
            {activeBanners.length > 1 && (
              <>
                <button onClick={prevSlide} className="absolute left-4 lg:left-10 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-all z-10 opacity-0 group-hover:opacity-100 duration-500 transform -translate-x-4 group-hover:translate-x-0 border border-white/10">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={nextSlide} className="absolute right-4 lg:right-10 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-all z-10 opacity-0 group-hover:opacity-100 duration-500 transform translate-x-4 group-hover:translate-x-0 border border-white/10">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
                </button>
              </>
            )}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
              {activeBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-700 ease-in-out ${currentSlide === idx ? 'w-12 bg-white' : 'w-3 bg-white/30 hover:bg-white/60'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* --- CATEGORIES SLIDER (SWIPE/SCROLL, NO BUTTONS) --- */}
        <div className="py-12 sm:py-20 relative">
          <div className="max-w-[100rem] mx-auto relative z-10">
            <div className="px-6 sm:px-10 lg:px-16 mb-10 sm:mb-14 text-center sm:text-left">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight animate-fade-up">
                Explore <span className="text-gradient">Collections</span>
              </h2>
              <p className="text-gray-500 mt-3 animate-fade-up" style={{ animationDelay: '100ms' }}>Swipe to discover our premium categories</p>
            </div>

            {/* Seamless Swipe Area */}
            <div className="relative w-full">
              {/* Fade gradients for edges */}
              <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-[#fcfdfd] to-transparent z-10 pointer-events-none" />
              <div className="absolute top-0 bottom-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-[#fcfdfd] to-transparent z-10 pointer-events-none" />

              <div 
                ref={categoryScrollRef} 
                className="flex overflow-x-auto hide-scrollbar gap-6 sm:gap-8 pb-12 pt-4 scroll-smooth snap-x snap-mandatory px-6 sm:px-10 lg:px-16"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {categories.length === 0 ? (
                  <p className="text-gray-400 italic text-center w-full">No categories available.</p>
                ) : (
                  categories.map((cat, index) => (
                    <Link
                      to={`/product-types/${cat.id}`}
                      key={cat.id}
                      className="flex-shrink-0 w-40 sm:w-52 lg:w-64 glass-card p-5 sm:p-8 rounded-[2.5rem] flex flex-col items-center text-center group snap-start animate-fade-up transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-blue-500/10"
                      style={{ animationDelay: `${index * 80}ms` }}
                    >
                      <div className="w-24 h-24 sm:w-32 sm:h-32 mb-6 rounded-full bg-white flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-700 p-2 shadow-inner border border-gray-50">
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-full" />
                      </div>
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 transition-colors duration-300 line-clamp-1">
                        {cat.name}
                      </h3>
                      <div className="mt-4 h-1 w-8 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-0 group-hover:w-full transition-all duration-500 ease-out" />
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- PRODUCTS SECTION --- */}
        <div className="max-w-[90rem] mx-auto px-6 sm:px-10 lg:px-16 mb-20 sm:mb-32 flex-grow w-full">
          <div className="flex flex-col mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold animate-fade-up">
              Trending <span className="text-gradient">Offers</span>
            </h2>
          </div>

          {products.length === 0 ? (
            <p className="text-gray-500 text-center py-10">No products yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 sm:gap-10">
              {products.map((product, idx) => (
                <div key={product.id} className="animate-fade-up" style={{ animationDelay: `${idx * 100}ms` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- AESTHETIC MODERN FOOTER --- */}
         <Footer/>
      </div>
    </>
  );
};

export default Home;