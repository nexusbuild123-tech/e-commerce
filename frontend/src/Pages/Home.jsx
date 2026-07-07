import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useRefresh } from '../context/RefreshContext';

const apiUrl = import.meta.env.VITE_API_URL;

const Home = () => {
  const categoryScrollRef = useRef(null);
  const scrollLeft = () => categoryScrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  const scrollRight = () => categoryScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });

  // --- STATE ---
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dbBanners, setDbBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const { refreshKey } = useRefresh();

  // --- FETCH FUNCTIONS ---
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

  // --- INITIAL FETCH & AUTO-REFRESH ---
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBanners();
    fetchCategories();
    fetchProducts();
  }, [refreshKey]);

  // --- BANNER SLIDE ---
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
    <div className="bg-gray-100 min-h-screen pb-0 animate-fade-in flex flex-col">
      
      {/* SLIDER */}
      <div className="relative w-full mx-auto mb-8">
        <div className="relative h-[300px] sm:h-[420px] lg:h-[550px] w-full overflow-hidden shadow-xl group">
          <div className="flex w-full h-full transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {activeBanners.map((banner) => (
              <div key={banner.id} className="min-w-full h-full relative flex items-center">
                <img src={banner.image_data} alt={banner.filename} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          {activeBanners.length > 1 && (
            <>
              <button onClick={prevSlide} className="absolute left-8 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md transition-all z-10">&#10094;</button>
              <button onClick={nextSlide} className="absolute right-8 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md transition-all z-10">&#10095;</button>
            </>
          )}
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Shop by Category</h2>
            <div className="flex gap-2">
              <button onClick={scrollLeft} className="p-3 rounded-full bg-white border border-gray-200 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm">&#10094;</button>
              <button onClick={scrollRight} className="p-3 rounded-full bg-white border border-gray-200 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm">&#10095;</button>
            </div>
          </div>
          <div ref={categoryScrollRef} className="flex overflow-x-auto hide-scrollbar gap-6 pb-8 scroll-smooth">
            {categories.length === 0 ? (
              <p className="text-gray-400 italic text-center w-full py-4">No categories setup yet.</p>
            ) : (
              categories.map((cat) => (
                <Link to={`/product-types/${cat.id}`} key={cat.id} className="flex-shrink-0 w-40 sm:w-48 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center group">
                  <div className="w-20 h-20 mb-4 rounded-2xl bg-blue-50 flex items-center justify-center overflow-hidden group-hover:bg-blue-600 transition-colors duration-300 p-2">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-xl transition-all" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{cat.name}</h3>
                  <span className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest font-semibold">Explore</span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="max-w-7xl mx-auto px-4 lg:px-0 mb-12 flex-grow">
        <div className="bg-white p-4 sm:p-6 rounded-sm shadow-sm border border-gray-100">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Trending Offers</h2>
          {products.length === 0 ? (
            <p className="text-gray-500 text-center py-6">No products found. Add some from the admin panel!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODERN FOOTER */}
      <footer className="relative bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white pt-16 pb-8 font-sans overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-emerald-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
            <div className="lg:col-span-1">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 tracking-tight">
                CRM Traders
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your trusted partner for quality products and exceptional service since 2007.
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 transform">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 transform">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 transform">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 transform">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">About</h4>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-gray-300 hover:text-white transition-all duration-200 hover:translate-x-1 inline-block hover:underline underline-offset-4 decoration-blue-500">About Us</Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-white transition-all duration-200 hover:translate-x-1 inline-block hover:underline underline-offset-4 decoration-blue-500">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Help</h4>
              <ul className="space-y-3">
                <li><Link to="/cancellation" className="text-gray-300 hover:text-white transition-all duration-200 hover:translate-x-1 inline-block hover:underline underline-offset-4 decoration-blue-500">Cancellation & Returns</Link></li>
                <li><Link to="/faq" className="text-gray-300 hover:text-white transition-all duration-200 hover:translate-x-1 inline-block hover:underline underline-offset-4 decoration-blue-500">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Consumer Policy</h4>
              <ul className="space-y-3">
                <li><Link to="/terms" className="text-gray-300 hover:text-white transition-all duration-200 hover:translate-x-1 inline-block hover:underline underline-offset-4 decoration-blue-500">Terms of Use</Link></li>
                <li><Link to="/privacy" className="text-gray-300 hover:text-white transition-all duration-200 hover:translate-x-1 inline-block hover:underline underline-offset-4 decoration-blue-500">Privacy Policy</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Contact</h4>
              <address className="not-italic text-gray-300 text-sm leading-relaxed space-y-1">
                <p>CRM Traders</p>
                <p>Purba Medinipur, 721423</p>
                <p>West Bengal, India</p>
                <p className="text-blue-400 font-medium">📞 9899518819</p>
                <a href="mailto:crmtraders25@gmail.com" className="text-blue-400 hover:underline inline-block">✉️ crmtraders25@gmail.com</a>
              </address>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 pt-8 gap-4">
            <p className="text-center md:text-left">
              © 2007-{new Date().getFullYear()} CRM Traders. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-white transition hover:scale-105 transform">Privacy</Link>
              <Link to="/terms" className="hover:text-white transition hover:scale-105 transform">Terms</Link>
              <Link to="/contact" className="hover:text-white transition hover:scale-105 transform">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;