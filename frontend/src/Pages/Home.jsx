import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const categoryScrollRef = useRef(null);
  const scrollLeft = () => categoryScrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  const scrollRight = () => categoryScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });

  // --- 1. DYNAMIC BANNER LOGIC ---
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dbBanners, setDbBanners] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/banners?t=${Date.now()}`, {
          cache: "no-store"
        });
        const data = await response.json();
        if (data.status === "success" && data.banners.length > 0) {
          setDbBanners(data.banners);
        }
      } catch (error) {
        console.error("Failed to load banners", error);
      }
    };

    fetchBanners();
    window.addEventListener("focus", fetchBanners);
    return () => window.removeEventListener("focus", fetchBanners);
  }, []);

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


  // --- 2. DYNAMIC CATEGORIES LOGIC (LIVE FROM DATABASE) ---
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/categories?t=${Date.now()}`, {
          cache: "no-store"
        });
        const data = await response.json();
        if (data.status === "success") {
          setCategories(data.categories); // Database categories array set kiya
        }
      } catch (error) {
        console.error("Failed to load categories from DB", error);
      }
    };

    fetchCategories();
    // Tab switch karne par auto categories refresh karne ke liye
    window.addEventListener("focus", fetchCategories);
    return () => window.removeEventListener("focus", fetchCategories);
  }, []);


  // --- 3. DYNAMIC PRODUCTS LOGIC (LIVE FROM DATABASE) ---
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/product-cards?t=${Date.now()}`, {
          cache: "no-store"
        });
        const data = await response.json();
        if (data.status === "success") {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Failed to load products from DB", error);
      }
    };

    fetchProducts();
    window.addEventListener("focus", fetchProducts);
    return () => window.removeEventListener("focus", fetchProducts);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen pb-0 animate-fade-in flex flex-col">
      
      {/* 1. FULL WIDTH HERO SLIDER */}
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

      {/* 2. DYNAMIC CATEGORIES SECTION */}
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

      {/* 3. TRENDING PRODUCTS */}
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

      {/* 4. FOOTER */}
      <footer className="bg-[#172337] text-white pt-12 pb-6 text-sm font-sans">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-10 border-b border-gray-600 pb-10">
            <div>
              <h3 className="text-gray-400 font-semibold mb-4 text-xs uppercase tracking-wider">About</h3>
              <ul className="space-y-2 text-gray-300 font-medium">
                <li><Link to="#" className="hover:underline">Contact Us</Link></li>
                <li><Link to="#" className="hover:underline">About Us</Link></li>
                <li><Link to="#" className="hover:underline">Careers</Link></li>
                <li><Link to="#" className="hover:underline">Electra Stories</Link></li>
                <li><Link to="#" className="hover:underline">Corporate Information</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-gray-400 font-semibold mb-4 text-xs uppercase tracking-wider">Help</h3>
              <ul className="space-y-2 text-gray-300 font-medium">
                <li><Link to="#" className="hover:underline">Payments</Link></li>
                <li><Link to="#" className="hover:underline">Shipping</Link></li>
                <li><Link to="#" className="hover:underline">Cancellation & Returns</Link></li>
                <li><Link to="#" className="hover:underline">FAQ</Link></li>
                <li><Link to="#" className="hover:underline">Report Infringement</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-gray-400 font-semibold mb-4 text-xs uppercase tracking-wider">Consumer Policy</h3>
              <ul className="space-y-2 text-gray-300 font-medium">
                <li><Link to="#" className="hover:underline">Cancellation & Returns</Link></li>
                <li><Link to="#" className="hover:underline">Terms Of Use</Link></li>
                <li><Link to="#" className="hover:underline">Security</Link></li>
                <li><Link to="#" className="hover:underline">Privacy</Link></li>
              </ul>
            </div>

            <div className="border-t border-gray-600 pt-6 md:border-t-0 md:pt-0 md:border-l pl-0 md:pl-8 col-span-1 lg:col-span-2 flex flex-col md:flex-row gap-8">
              <div>
                <h3 className="text-gray-400 font-semibold mb-4 text-xs uppercase tracking-wider">Mail Us:</h3>
                <p className="text-gray-300 leading-relaxed text-xs">
                  CRM Traders, <br/>
                  Buildings Alyssa, Begonia & <br/>
                  Clove Embassy Tech Village, <br/>
                  Outer Ring Road, Devarabeesanahalli Village, <br/>
                  Bengaluru, 560103, <br/>
                  Karnataka, India
                </p>
              </div>
              <div>
                <h3 className="text-gray-400 font-semibold mb-4 text-xs uppercase tracking-wider">Registered Office Address:</h3>
                <p className="text-gray-300 leading-relaxed text-xs">
                  CRM Traders, <br/>
                  Bengaluru, 560103, <br/>
                  Karnataka, India <br/>
                  CIN : U51109KA2012PTC066107 <br/>
                  Telephone: <span className="text-blue-400">044-45614700</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between text-xs text-gray-300 font-medium gap-4">
            <div className="flex flex-wrap gap-4 md:gap-8 justify-center">
              <span className="flex items-center gap-2">⭐ Become a Seller</span>
              <span className="flex items-center gap-2">🎯 Advertise</span>
              <span className="flex items-center gap-2">🎁 Gift Cards</span>
              <span className="flex items-center gap-2">❓ Help Center</span>
            </div>
            <p>© 2007-{new Date().getFullYear()} crmtraders.com</p>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default Home;