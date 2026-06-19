import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Home = () => {
  // --- HIERARCHICAL CATEGORY DATA ---
  const categoriesTree = [
    { 
      id: 1, name: "Air Conditioners", slug: "air-conditioners", image: "https://via.placeholder.com/100?text=AC",
      subCategories: [
        { name: "Split ACs", slug: "split-acs", children: ["1 Ton", "1.5 Ton", "2 Ton"] },
        { name: "Window ACs", slug: "window-acs", children: ["1 Ton", "1.5 Ton"] }
      ]
    },
    { 
      id: 2, name: "Refrigerators", slug: "refrigerators", image: "https://via.placeholder.com/100?text=Fridge",
      subCategories: [
        { name: "Single Door", slug: "single-door", children: ["Under 200L", "200L - 250L"] },
        { name: "Double Door", slug: "double-door", children: ["250L - 300L", "Above 300L"] }
      ]
    },
    { id: 3, name: "Washing Machines", slug: "washing-machines", image: "https://via.placeholder.com/100?text=Wash" },
    { id: 4, name: "Kitchen Appliances", slug: "kitchen", image: "https://via.placeholder.com/100?text=Kitchen" },
    { id: 5, name: "Microwaves", slug: "microwaves", image: "https://via.placeholder.com/100?text=Oven" },
    { id: 6, name: "Water Purifiers", slug: "purifiers", image: "https://via.placeholder.com/100?text=RO" },
    { id: 7, name: "Televisions", slug: "televisions", image: "https://via.placeholder.com/100?text=TV" },
    { id: 8, name: "Mixer Grinders", slug: "mixers", image: "https://via.placeholder.com/100?text=Mixer" },
  ];

  const categoryScrollRef = useRef(null);
  const scrollLeft = () => categoryScrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  const scrollRight = () => categoryScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });

  // --- HERO CAROUSEL ---
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroBanners = [
    { id: 1, title: "Smart Cooling for Smart Homes", subtitle: "Up to 40% OFF on Inverter ACs", badge: "Summer Sale", bgGradient: "from-slate-900 via-slate-800 to-blue-950", accentColor: "text-blue-400" },
    { id: 2, title: "Keep it Fresh, Keep it Healthy", subtitle: "Exchange your old fridge & get ₹5000 Bonus", badge: "Exchange Offer", bgGradient: "from-gray-900 via-slate-800 to-emerald-950", accentColor: "text-emerald-400" },
    { id: 3, title: "Next-Gen Washing Machines", subtitle: "Zero EMI + Free Installation this weekend", badge: "Weekend Special", bgGradient: "from-indigo-950 via-slate-900 to-purple-950", accentColor: "text-purple-400" }
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroBanners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [heroBanners.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev === heroBanners.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? heroBanners.length - 1 : prev - 1));

  const [products] = useState([
    { id: 1, name: "LG 1.5 Ton 5 Star AC", category: "Air Conditioners", price: 45000, image: "https://via.placeholder.com/400x300?text=LG+AC" },
    { id: 2, name: "Samsung 253L Fridge", category: "Refrigerators", price: 24500, image: "https://via.placeholder.com/400x300?text=Samsung+Fridge" },
    { id: 3, name: "Bosch 7kg Washing Machine", category: "Washing Machines", price: 29990, image: "https://via.placeholder.com/400x300?text=Bosch" },
    { id: 4, name: "Bajaj 17L Microwave", category: "Microwaves", price: 5299, image: "https://via.placeholder.com/400x300?text=Bajaj" }
  ]);

  return (
    <div className="bg-gray-100 min-h-screen pb-0 animate-fade-in flex flex-col">
      
      {/* 1. FULL WIDTH HERO SLIDER */}
      <div className="relative w-full mx-auto mb-8">
        <div className="relative h-[300px] sm:h-[420px] lg:h-[550px] w-full overflow-hidden shadow-xl group">
          <div className="flex w-full h-full transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {heroBanners.map((banner) => (
              <div key={banner.id} className={`min-w-full h-full bg-gradient-to-r ${banner.bgGradient} relative flex items-center`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 w-full">
                  <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold uppercase tracking-widest rounded-full bg-white/10 text-white backdrop-blur-md border border-white/10 shadow-sm">
                    {banner.badge}
                  </span>
                  <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight max-w-4xl drop-shadow-lg">
                    {banner.title.split(',')[0]} <span className={banner.accentColor}>{banner.title.split(',')[1] || ''}</span>
                  </h1>
                  <p className="text-lg sm:text-xl lg:text-2xl text-slate-200 mb-10 max-w-2xl font-medium leading-relaxed">
                    {banner.subtitle}
                  </p>
                  <button className="bg-white text-gray-900 hover:bg-blue-600 hover:text-white font-bold px-10 py-4 rounded-xl shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-base sm:text-lg">
                    Shop Collection
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={prevSlide} className="absolute left-8 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md transition-all z-10">&#10094;</button>
          <button onClick={nextSlide} className="absolute right-8 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md transition-all z-10">&#10095;</button>
        </div>
      </div>

      {/* 2. CATEGORIES */}
      {/* 2. MODERN SHOP BY CATEGORY */}
<div className="py-16 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between mb-10">
      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Shop by Category</h2>
      <div className="flex gap-2">
        <button onClick={scrollLeft} className="p-3 rounded-full bg-white border border-gray-200 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm">
          &#10094;
        </button>
        <button onClick={scrollRight} className="p-3 rounded-full bg-white border border-gray-200 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm">
          &#10095;
        </button>
      </div>
    </div>

    {/* Categories Container */}
    <div 
      ref={categoryScrollRef}
      className="flex overflow-x-auto hide-scrollbar gap-6 pb-8 scroll-smooth"
    >
      {categoriesTree.map((cat) => (
        <Link 
          to={`/category-types/${cat.id}`} 
          key={cat.id} 
          className="flex-shrink-0 w-40 sm:w-48 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center group"
        >
          <div className="w-20 h-20 mb-4 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
            {/* Yahan aap icon ya image use kar sakte hain */}
            <img src={cat.image} alt={cat.name} className="w-12 h-12 object-contain filter group-hover:brightness-0 group-hover:invert transition-all" />
          </div>
          <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {cat.name}
          </h3>
          <span className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest font-semibold">Explore</span>
        </Link>
      ))}
    </div>
  </div>
</div>
      {/* 3. TRENDING PRODUCTS */}
      <div className="max-w-7xl mx-auto px-4 lg:px-0 mb-12 flex-grow">
        <div className="bg-white p-4 sm:p-6 rounded-sm shadow-sm border border-gray-100">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Trending Offers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </div>

      {/* 4. FOOTER */}
     <footer className="bg-[#172337] text-white pt-12 pb-6 text-sm font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Top Section: Links Grid */}
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
                Electra Internet Private Limited, <br/>
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
                Electra Internet Private Limited, <br/>
                Bengaluru, 560103, <br/>
                Karnataka, India <br/>
                CIN : U51109KA2012PTC066107 <br/>
                Telephone: <span className="text-blue-400">044-45614700</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Section: Highlights & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-gray-300 font-medium gap-4">
          <div className="flex flex-wrap gap-4 md:gap-8 justify-center">
            <span className="flex items-center gap-2">⭐ Become a Seller</span>
            <span className="flex items-center gap-2">🎯 Advertise</span>
            <span className="flex items-center gap-2">🎁 Gift Cards</span>
            <span className="flex items-center gap-2">❓ Help Center</span>
          </div>
          <p>© 2007-{new Date().getFullYear()} Electra.com</p>
        </div>

      </div>
    </footer>
    </div>
  );
};

export default Home;