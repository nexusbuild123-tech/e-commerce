import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Toast from "../components/Toast";
import LocationPicker from "../components/LocationPicker";

const apiUrl = import.meta.env.VITE_API_URL;

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const state = location.state || {};

  // Derived items from state – used only for initialisation
  const initialItems = useMemo(() => {
    return state.cartItems || (state.product ? [state.product] : []);
  }, [state.cartItems, state.product]);

  const isFromCart = !!state.cartItems;

  // Local mutable items with quantity controls
  const [items, setItems] = useState(() =>
    initialItems.map((item) => ({
      ...item,
      quantity: item.quantity || 1,
    })),
  );

  // Recalculate total when items change
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return {
        customer_name: user.name || "",
        customer_email: user.email || "",
        customer_phone: user.mobile || "",
        city: "",
        state: "",
        pincode: "",
        delivery_address: "",
      };
    }
    return {
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      city: "",
      state: "",
      pincode: "",
      delivery_address: "",
    };
  });

  // Redirect if no items
  useEffect(() => {
    if (items.length === 0) {
      navigate("/");
    }
  }, [items, navigate]);

  if (items.length === 0) {
    return null;
  }

  // ---- Quantity handlers per item ----
  const increaseQuantity = (index) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index && item.quantity < 99
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  const decreaseQuantity = (index) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    );
  };

  const handleQuantityChange = (index, val) => {
    const qty = parseInt(val);
    if (!isNaN(qty) && qty >= 1 && qty <= 99) {
      setItems((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, quantity: qty } : item,
        ),
      );
    }
  };

  // ---- Form handlers ----
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationSelected = (data) => {
    setFormData((prev) => ({
      ...prev,
      city: data.city || prev.city,
      state: data.state || prev.state,
      pincode: data.pincode || prev.pincode,
      delivery_address: data.fullAddress || prev.delivery_address,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.customer_name ||
      !formData.customer_email ||
      !formData.customer_phone ||
      !formData.delivery_address ||
      !formData.city ||
      !formData.pincode
    ) {
      setToast({
        message:
          "Please fill all fields (Name, Email, Phone, Address, City, Pincode).",
        type: "error",
      });
      return;
    }

    const finalAddress = formData.delivery_address.includes(formData.city)
      ? formData.delivery_address
      : `${formData.delivery_address}, ${formData.city}, ${formData.state}, ${formData.pincode}`;

    setLoading(true);
    try {
      for (const item of items) {
        const payload = {
          product_type_id: item.id,
          variant_id: item.variant?.id || null,
          product_name: item.name,
          variant_name: item.variant?.color || null,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity,
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone,
          delivery_address: finalAddress,
        };

        const res = await fetch(`${apiUrl}/place-order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "nexusBuild@123+!",
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Order failed");
        }
      }

      if (isFromCart) {
        clearCart();
      }

      setToast({
        message:
          "🎉 All orders placed successfully! We will contact you shortly.",
        type: "success",
      });
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Order error:", error);
      setToast({
        message: error.message || "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-zinc-900 antialiased selection:bg-zinc-950 selection:text-white relative overflow-x-hidden">
      {/* Soft Ambient Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-200/40 via-transparent to-transparent pointer-events-none z-0" />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14 lg:py-24 relative z-10 transition-all duration-500">
        {/* Immersive Fine-Art Header */}
        <header className="mb-14 text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-white border border-zinc-200/80 px-3 py-1 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.02)] transform transition-transform duration-300 hover:scale-102">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
              Secure Gateway
            </span>
          </div>
          <h1 className="text-3xl sm:text-6xl font-bold tracking-tight text-zinc-900">
            {isFromCart ? "Review your bag" : "Checkout securely"}
          </h1>
        </header>

        <div className="space-y-8">
          {/* Module 1: Order Items Breakdown */}
          <div className="bg-white border border-zinc-200/70 rounded-[2rem] p-6 sm:p-8 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_16px_48px_-10px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100">
              <h2 className="text-[15px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-zinc-900 rounded-full" /> 01 /
                Selected Items
              </h2>
              <span className="text-md font-medium text-zinc-600 bg-zinc-50 border border-zinc-100 px-3 py-1 rounded-full">
                {items.reduce((acc, item) => acc + item.quantity, 0)}{" "}
                {items.reduce((acc, item) => acc + item.quantity, 0) > 1
                  ? "items"
                  : "item"}
              </span>
            </div>

            <div className="divide-y divide-zinc-100 space-y-4">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-5 pt-4 first:pt-0 group transition-all"
                >
                  {/* Elevated Product Thumbnail */}
                  <div className="w-16 h-16 bg-zinc-50 border border-zinc-200/50 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center p-2 transform transition-transform duration-500 group-hover:scale-105 shadow-inner">
                    <img
                      src={item.image || "https://via.placeholder.com/80"}
                      alt={item.name}
                      className="w-full h-[full] object-contain mix-blend-multiply"
                    />
                  </div>

                  {/* Product Meta */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-zinc-800 truncate transition-colors group-hover:text-zinc-950">
                      {item.name}
                    </h3>
                    {item.variant && (
                      <span className="inline-flex items-center text-[15px] text-zinc-400 font-medium bg-zinc-50 border border-zinc-200/40 px-1.5 py-0.5 rounded mt-1">
                        Color: {item.variant.color}
                      </span>
                    )}

                    {/* Micro Counter (Fixes lint error by restoring used input) */}
                    <div className="flex items-center bg-zinc-50 border border-zinc-200/60 w-fit rounded-lg p-0.5 mt-2.5 transition-all duration-300 focus-within:border-zinc-400 shadow-sm">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(idx)}
                        className="w-5 h-5 rounded-md flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-white transition active:scale-90 disabled:opacity-20 text-[10px]"
                        disabled={item.quantity <= 1}
                      >
                        —
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(idx, e.target.value)
                        }
                        className="w-8 text-center bg-transparent border-0 p-0 text-xs font-bold text-zinc-800 outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        onClick={() => increaseQuantity(idx)}
                        className="w-5 h-5 rounded-md flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-white transition active:scale-90 disabled:opacity-20 text-[10px]"
                        disabled={item.quantity >= 99}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Pricing Block */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-bold text-zinc-900 tracking-tight">
                      ₹
                      {(item.price * item.quantity).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Module 2: Shipping Form */}
          <div className="bg-white border border-zinc-200/70 rounded-[2rem] p-6 sm:p-8 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_16px_48px_-10px_rgba(0,0,0,0.05)]">
            <div className="mb-8 pb-4 border-b border-zinc-100">
              <h2 className="text-[15px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-zinc-900 rounded-full" /> 02 /
                Shipping & Delivery
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Input Wrapper - Full Name */}
              <div className="group relative">
                <label className="block text-[15px] font-bold text-zinc-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-zinc-900">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 bg-zinc-50/50 border border-zinc-200/80 rounded-xl text-zinc-900 text-sm focus:outline-none focus:border-zinc-900 focus:bg-white focus:ring-4 focus:ring-zinc-900/5 transition-all duration-300 shadow-sm"
                  placeholder="Enter full name"
                  required
                />
              </div>

              {/* Contact Grid */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="group">
                  <label className="block text-[15px] font-bold text-zinc-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-zinc-900">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-zinc-50/50 border border-zinc-200/80 rounded-xl text-zinc-900 text-sm focus:outline-none focus:border-zinc-900 focus:bg-white focus:ring-4 focus:ring-zinc-900/5 transition-all duration-300 shadow-sm"
                    placeholder="name@example.com"
                    required
                  />
                </div>
                <div className="group">
                  <label className="block text-[15px] font-bold text-zinc-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-zinc-900">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-zinc-50/50 border border-zinc-200/80 rounded-xl text-zinc-900 text-sm focus:outline-none focus:border-zinc-900 focus:bg-white focus:ring-4 focus:ring-zinc-900/5 transition-all duration-300 shadow-sm"
                    placeholder="10-digit mobile number"
                    required
                  />
                </div>
              </div>

              {/* Immersive Map Module */}
              <div className="space-y-2">
                <label className="block text-[14px] font-bold text-zinc-400 uppercase tracking-widest">
                  Pin Address on Map
                </label>
                <div className="rounded-2xl overflow-hidden border border-zinc-200/80 shadow-md transition-all duration-300 hover:border-zinc-300">
                  <LocationPicker onLocationSelected={handleLocationSelected} />
                </div>
              </div>

              {/* Location Credentials Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="group">
                  <label className="block text-[15px] font-bold text-zinc-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-zinc-900">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-zinc-50/50 border border-zinc-200/80 rounded-xl text-zinc-900 text-sm focus:outline-none focus:border-zinc-900 focus:bg-white transition-all duration-300 shadow-sm"
                    required
                  />
                </div>
                <div className="group">
                  <label className="block text-[15px] font-bold text-zinc-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-zinc-900">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-zinc-50/50 border border-zinc-200/80 rounded-xl text-zinc-900 text-sm focus:outline-none focus:border-zinc-900 focus:bg-white transition-all duration-300 shadow-sm"
                    required
                  />
                </div>
                <div className="col-span-2 sm:col-span-1 group">
                  <label className="block text-[15px] font-bold text-zinc-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-zinc-900">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-zinc-50/50 border border-zinc-200/80 rounded-xl text-zinc-900 text-sm focus:outline-none focus:border-zinc-900 focus:bg-white transition-all duration-300 shadow-sm"
                  />
                </div>
              </div>

              {/* Street Address */}
              <div className="group">
                <label className="block text-[15px] font-bold text-zinc-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-zinc-900">
                  Street Address *
                </label>
                <textarea
                  name="delivery_address"
                  rows="3"
                  value={formData.delivery_address}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 bg-zinc-50/50 border border-zinc-200/80 rounded-xl text-zinc-900 text-sm focus:outline-none focus:border-zinc-900 focus:bg-white focus:ring-4 focus:ring-zinc-900/5 transition-all duration-300 resize-none leading-relaxed shadow-sm"
                  placeholder="House/Flat No., Apartment, Street name, Landmark"
                  required
                />
              </div>

              {/* Sticky-Feel Ultra-Premium Pricing Panel */}
              <div className="mt-12 pt-6 border-t border-zinc-100 space-y-4">
                <div className="flex justify-between items-center bg-zinc-950 text-white p-5 rounded-2xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] relative overflow-hidden group">
                  <div className="absolute inset-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.03)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_4s_infinite_linear]" />
                  <div className="space-y-1 relative z-10">
                    <span className="text-[14px] font-bold text-zinc-400 uppercase tracking-widest block">
                      Total Payable
                    </span>
                  </div>
                  <div className="text-right relative z-10">
                    <span className="text-2xl sm:text-3xl font-light tracking-tight">
                      ₹
                      {totalAmount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                    <p className="text-[13px] text-zinc-400 font-medium tracking-wide mt-0.5">
                      Cash on Delivery
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-xl transition-all duration-300 active:scale-[0.99] disabled:opacity-30 flex items-center justify-center text-lg tracking-wide shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  {loading ? (
                    <div className="flex items-center gap-2.5">
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span className="text-zinc-300">Securing order...</span>
                    </div>
                  ) : (
                    "Place Order via COD"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
