import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo1.png";

const apiUrl = import.meta.env.VITE_API_URL;

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false); // Dynamic Categories Open State
  const [categories, setCategories] = useState([]); // Categories storage state

  const [location, setLocation] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.location) {
        return userData.location;
      }
    }
    return "Fetching location...";
  });

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const navigate = useNavigate();

  // --- FETCH SHOP CATEGORIES FOR DROPDOWN (Bypassing ESLint Cascade) ---
  useEffect(() => {
    let ignore = false;
    const loadCategories = async () => {
      try {
        const response = await fetch(`${apiUrl}/categories?t=${Date.now()}`);
        const data = await response.json();
        if (!ignore && data.status === "success") {
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error("Failed to load navbar categories", error);
      }
    };
    loadCategories();
    return () => {
      ignore = true;
    };
  }, []);

  // Current Location Fetch
  useEffect(() => {
    if (user?.location) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
            );

            const data = await response.json();

            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              "";

            const pincode = data.address.postcode || "";

            setLocation(`${city}, ${pincode}`);
          } catch (error) {
            console.log(error);
            setLocation("Location unavailable");
          }
        },
        () => {
          setLocation("Location unavailable");
        },
      );
    }
  }, [user?.location]);

  // Scroll + Auth Change
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);

    window.addEventListener("scroll", handleScroll);

    const checkUser = () => {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const userData = JSON.parse(storedUser);

        setUser(userData);

        if (userData.location) {
          setLocation(userData.location);
        }
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
          const updatedUser = {
            ...user,
            location: newLocation,
          };

          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUser(updatedUser);
        }
      } catch (err) {
        console.log(err);
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
      className={`sticky top-0 z-50 w-full transition-all duration-500 ease-in-out border-b border-white/20
        ${
          isScrolled
            ? "py-2 bg-white/70 backdrop-blur-xl shadow-lg shadow-blue-900/5"
            : "py-5 bg-white/40 backdrop-blur-md"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <img src={Logo} alt="Logo" className="h-[92px]" />
          </Link>

          {/* Location Picker Section */}
          <button
            onClick={handleLocationChange}
            className="hidden lg:flex items-center space-x-2 text-slate-700 hover:text-blue-600 transition-colors ml-6"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>

            <div className="text-xs font-bold text-left">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                Deliver to
              </p>
              <p className="text-sm font-semibold">{location}</p>
            </div>
          </button>

          {/* Nav Navigation Menu Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold tracking-wide text-slate-700 ml-auto mr-8">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>

            {/* CHANGED: ALL PRODUCTS DYNAMIC DROPDOWN TOGGLER */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsCategoriesOpen(!isCategoriesOpen);
                  setIsProfileOpen(false); // Close profile if open
                }}
                className="flex items-center space-x-1 hover:text-blue-600 transition-colors font-semibold focus:outline-none"
              >
                <span>All Products</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${isCategoriesOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {/* DYNAMIC CATEGORIES LIST DROPDOWN PANEL */}
              {isCategoriesOpen && (
                <div className="absolute left-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 py-2 animate-fade-in">
                  {categories.length === 0 ? (
                    <p className="text-xs text-gray-400 px-4 py-3">
                      No category structures found.
                    </p>
                  ) : (
                    categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.slug}`}
                        onClick={() => setIsCategoriesOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center p-1 border">
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <span className="truncate">{cat.name}</span>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>

            <Link
              to="/track-order"
              className="hover:text-blue-600 transition-colors"
            >
              Track Order
            </Link>
          </div>

          {/* Profile Actions / Auth Blocks */}
          <div className="hidden md:flex items-center space-x-4 text-slate-700">
            <div className="flex items-center border-l border-gray-300 pl-4 ml-2 relative">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsProfileOpen(!isProfileOpen);
                      setIsCategoriesOpen(false); // Close categories dropdown if open
                    }}
                    className="flex items-center space-x-2 group hover:bg-slate-100 p-1.5 rounded-xl transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-100 text-blue-700 font-bold rounded-full flex items-center justify-center uppercase shadow-sm">
                      {user.name ? user.name.charAt(0) : "U"}
                    </div>

                    <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600">
                      Hi, {user.name ? user.name.split(" ")[0] : "User"}
                    </span>

                    <svg
                      className="w-4 h-4 text-slate-400 group-hover:text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                      <div className="px-4 py-3 bg-slate-50 border-b border-gray-100">
                        <p className="text-sm font-black text-slate-800 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs font-semibold text-slate-500 truncate">
                          {user.email}
                        </p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="block w-full text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Edit Profile
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="text-sm font-bold bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 shadow-sm shadow-blue-600/20 transition-all"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Hamburger Menu Icon Trigger */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-800 p-1"
            >
              {isMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE RESPONSIVE DRAWER OVERLAY MENU */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-xl border-t border-gray-100 mt-2 px-4 py-4 space-y-3 shadow-inner">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="block text-sm font-bold text-slate-700 hover:text-blue-600 py-1"
          >
            Home
          </Link>

          {/* Mobile All Category Section List Accordion */}
          <div className="border-y border-gray-100 py-2">
            <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
              Product Categories
            </p>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-blue-600 bg-slate-50 p-2 rounded-lg"
                >
                  <img
                    src={cat.image}
                    className="w-5 h-5 object-contain"
                    alt=""
                  />
                  <span className="truncate">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <Link
            to="/track-order"
            onClick={() => setIsMenuOpen(false)}
            className="block text-sm font-bold text-slate-700 hover:text-blue-600 py-1"
          >
            Track Order
          </Link>

          {/* Mobile Profile / Authentication Check */}
          {!user ? (
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex-1 text-center font-bold text-sm text-slate-700 border p-2 rounded-xl bg-slate-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="flex-1 text-center font-bold text-sm text-white bg-blue-600 p-2 rounded-xl"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500">
                Logged in as{" "}
                <b className="text-slate-800">{user.name.split(" ")[0]}</b>
              </span>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="text-xs font-black text-red-500 hover:underline"
              >
                Logout 🚪
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
