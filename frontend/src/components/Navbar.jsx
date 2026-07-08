import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo1.png";
import { useCart } from "../context/CartContext";

// React Icons Imports
import { 
  FiShoppingCart, 
  FiMapPin, 
  FiUser, 
  FiLogOut, 
  FiMenu, 
  FiX, 
  FiChevronDown,
  FiShoppingBag
} from "react-icons/fi";

const apiUrl = import.meta.env.VITE_API_URL;

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const { totalItems } = useCart();
  const navigate = useNavigate();

  const [location, setLocation] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.location) return userData.location;
    }
    return "Fetching location...";
  });

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- LOCATION DETECTION ---
  useEffect(() => {
    if (user?.location) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
            );
            const data = await response.json();

            const city = data.address.city || data.address.town || data.address.village || "";
            const pincode = data.address.postcode || "";

            setLocation(`${city}${pincode ? `, ${pincode}` : ""}`);
          } catch (error) {
            console.error(error);
            setLocation("Location unavailable");
          }
        },
        () => setLocation("Location unavailable")
      );
    }
  }, [user?.location]);

  // --- SCROLL & AUTH LISTENERS ---
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        if (userData.location) setLocation(userData.location);
      } else {
        setUser(null);
      }
    };

    window.addEventListener("authChange", checkUser);
    checkUser();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("authChange", checkUser);
    };
  }, []);

  // --- LOCATION UPDATE ---
  const handleLocationChange = async () => {
    const newLocation = prompt("Enter your area or pincode:", location);
    if (!newLocation) return;

    setLocation(newLocation);

    if (user) {
      try {
        const response = await fetch(`${apiUrl}/update-location`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "nexusBuild@123+!",
          },
          body: JSON.stringify({
            id: user.id,
            location: newLocation,
          }),
        });

        const data = await response.json();
        if (data.status === "success") {
          const updatedUser = { ...user, location: newLocation };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUser(updatedUser);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsProfileOpen(false);
    navigate("/login");
  };

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 border-b
        ${
          isScrolled
            ? "py-2 bg-white/80 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.03)] border-slate-100"
            : "py-4 bg-transparent border-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LEFT: LOGO & LOCATION */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center transition-transform active:scale-95">
              <img src={Logo} alt="Logo" className="h-20 w-auto object-contain" />
            </Link>

            {/* LOCATION PICKER */}
            <button
              onClick={handleLocationChange}
              className="hidden lg:flex items-center space-x-2.5 px-3 py-1.5 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-all duration-200"
            >
              <FiMapPin className="w-4 h-4 text-blue-500 animate-pulse" />
              <div className="text-left">
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                  Deliver to
                </span>
                <span className="block text-xs font-semibold max-w-[150px] truncate">
                  {location}
                </span>
              </div>
            </button>
          </div>

          {/* CENTER: NAV LINKS */}
          <div className="hidden md:flex items-center space-x-1 bg-slate-100/60 p-1 rounded-full border border-slate-200/50">
            <Link to="/" className="px-5 py-2 text-md hover:text-xs font-bold tracking-wide rounded-full text-slate-600 hover:text-slate-900 transition-all">
              Home
            </Link>
            <Link to="/products" className="px-5 py-2 text-md hover:text-xs font-bold tracking-wide rounded-full text-slate-600 hover:text-slate-900 transition-all">
              All Products
            </Link>
            <Link to="/track-order" className="px-5 py-2 text-md hover:text-xs font-bold tracking-wide rounded-full text-slate-600 hover:text-slate-900 transition-all">
              Track Order
            </Link>
          </div>

          {/* RIGHT: CART & AUTH */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* CART BUTTON */}
            <Link
              to="/cart"
              className="relative p-3 text-slate-700 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-full transition-all group active:scale-95"
              aria-label="Cart"
            >
              <FiShoppingCart className="w-5 h-5 transition-transform group-hover:scale-105" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center shadow-md shadow-blue-500/20 animate-none">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* PROFILE DROPDOWN MANAGER */}
            <div className="relative" ref={profileRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2.5 px-3 py-2.5 bg-slate-100/60 text-black rounded-full transition-all  active:scale-98 shadow-sm"
                  >
                    <div className="w-6 h-6 bg-white/20 text-black text-md font-black rounded-full flex items-center justify-center uppercase">
                      {user.name ? user.name.charAt(0) : "U"}
                    </div>
                    <span className="text-md font-bold tracking-wide">
                      Hi, {user.name ? user.name.split(" ")[0] : "User"}
                    </span>
                    <FiChevronDown className={`w-3 h-3 text-slate-300 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* FLOATING DROPDOWN */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2.5 w-60 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-slate-100 p-2 z-50 transform origin-top-right transition-all">
                      <div className="px-3 py-2.5 bg-slate-50 rounded-xl mb-1">
                        <p className="text-md font-black text-slate-800 truncate">{user.name}</p>
                        <p className="text-[12px] font-medium text-slate-400 truncate mt-0.5">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-2 px-3 py-2 text-md font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      >
                        <FiUser className="w-3.5 h-3.5" />
                        <span>Edit Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full text-left px-3 py-2 text-md font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <FiLogOut className="w-3.5 h-3.5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center space-x-1 pl-2">
                  <Link
                    to="/login"
                    className="text-sm font-bold text-slate-600 hover:text-slate-900 px-4 py-2 transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm font-bold bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 shadow-sm shadow-blue-600/10 transition-all active:scale-95"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

          </div>

          {/* MOBILE TOGGLE & CART BUTTON */}
          <div className="md:hidden flex items-center space-x-2">
            <Link to="/cart" className="relative p-2.5 bg-slate-50 text-slate-700 rounded-full" aria-label="Cart">
              <FiShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 bg-slate-50 text-slate-800 rounded-full active:scale-95 transition-all"
            >
              {isMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/20 border-t text-white border-slate-100 px-4 py-4 space-y-2.5 shadow-xl">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="block text-sm font-bold text-black  hover:text-blue-600 px-3 py-2 hover:bg-slate-50 rounded-xl transition-all"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setIsMenuOpen(false)}
            className="block text-sm font-bold text-black hover:text-blue-600 px-3 py-2 hover:bg-slate-50 rounded-xl transition-all"
          >
            All Products
          </Link>
          <Link
            to="/track-order"
            onClick={() => setIsMenuOpen(false)}
            className="block text-sm font-bold text-black hover:text-blue-600 px-3 py-2 hover:bg-slate-50 rounded-xl transition-all"
          >
            Track Order
          </Link>

          {!user ? (
            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex-1 text-center font-bold text-xs text-slate-600 border border-slate-200 py-2.5 rounded-xl bg-slate-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="flex-1 text-center font-bold text-xs text-white bg-blue-600 py-2.5 rounded-xl shadow-sm"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between px-2">
              <div className="flex items-center space-x-2">
                <FiShoppingBag className="text-black w-4 h-4" />
                <span className="text-sm font-semibold text-gray-900">
                  Hi, <b className="text-slate-800">{user.name.split(" ")[0]}</b>
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-md font-bold text-blue-600 hover:underline"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-1 text-md font-bold text-red-500 hover:underline"
                >
                  <FiLogOut className="w-3 h-3" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;