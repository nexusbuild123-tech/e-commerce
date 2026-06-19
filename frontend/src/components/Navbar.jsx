import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // State ab use ho rahi hai, warning nahi aayegi
  const [location, setLocation] = useState("Balasore, 756001");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Location update karne ka function
  const handleLocationChange = () => {
    const newLocation = prompt("Enter your area or pincode:", location);
    if (newLocation) {
      setLocation(newLocation);
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-500 ease-in-out border-b border-white/20
        ${isScrolled 
          ? 'py-2 bg-white/70 backdrop-blur-xl shadow-lg shadow-blue-900/5' 
          : 'py-5 bg-white/40 backdrop-blur-md'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <svg className="h-7 w-7 text-blue-600 transition-transform group-hover:rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <rect x="9" y="9" width="6" height="6" />
              <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
            </svg>
            <span className="text-xl font-black tracking-wider text-slate-900 font-sans">
              ELECTRA<span className="text-blue-600">.</span>
            </span>
          </Link>

          {/* Location Selector (Clickable) */}
          <button 
            onClick={handleLocationChange}
            className="hidden lg:flex items-center space-x-2 text-slate-700 hover:text-blue-600 transition-colors ml-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <div className="text-xs font-bold text-left">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Deliver to</p>
              <p className="text-sm font-semibold">{location}</p>
            </div>
          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold tracking-wide text-slate-700 ml-auto mr-8">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <a href="#appliances" className="hover:text-blue-600 transition-colors">All Products</a>
            <Link to="/track-order" className="hover:text-blue-600 transition-colors">Track Order</Link>
          </div>

          {/* Action Icons */}
          <div className="hidden md:flex items-center space-x-5 text-slate-700">
            <button className="hover:text-blue-600 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></button>
            <button className="hover:text-blue-600 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></button>
            <Link to="/cart" className="relative p-1.5 hover:text-blue-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-800 p-1">
              {isMenuOpen ? <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg> : <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-2xl transition-all duration-300 ease-in-out border-b border-gray-200 overflow-hidden ${isMenuOpen ? 'max-h-screen py-6' : 'max-h-0'}`}>
        <div className="px-6 space-y-4">
          <button onClick={handleLocationChange} className="text-xs font-bold text-blue-600 uppercase">Change Location: {location}</button>
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="block py-2 font-medium">Home</Link>
          <a href="#appliances" onClick={() => setIsMenuOpen(false)} className="block py-2 font-medium">Appliances</a>
          <Link to="/track-order" onClick={() => setIsMenuOpen(false)} className="block py-2 font-medium">Track Order</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;