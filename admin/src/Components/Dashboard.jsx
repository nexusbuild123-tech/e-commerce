import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  // Kaunsa tab abhi open hai usko track karne ke liye state
  const [activeTab, setActiveTab] = useState("Dashboard");
  const navigate = useNavigate();

  // Component load hote hi check karein ki admin logged in hai ya nahi
  useEffect(() => {
    const adminUser = localStorage.getItem("admin_user");
    if (!adminUser) {
      // Agar logged in nahi hai toh wapas login page bhej dein
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin_user"); // Admin ka data remove karein
    navigate("/admin/login"); // Login page par redirect karein
  };

  // Sidebar ke items ki list
  const menuItems = [
    { name: "Dashboard", icon: "📊" },
    { name: "Home Banner", icon: "🖼️" },
    { name: "Product Card", icon: "💳" },
    { name: "Product Type", icon: "🏷️" },
    { name: "Product Details", icon: "📦" },
    { name: "Order", icon: "🛒" },
  ];

  // Right side area mein kya dikhana hai, uska logic
  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">1,250</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-gray-500 text-sm font-medium">
                Total Orders
              </h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">320</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-gray-500 text-sm font-medium">Revenue</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">₹45,000</p>
            </div>
          </div>
        );
      case "Product Card":
        return (
          <div className="bg-white p-8 rounded-xl shadow-sm">
            💳 Manage your Product Cards here.
          </div>
        );
      case "Product Type":
        return (
          <div className="bg-white p-8 rounded-xl shadow-sm">
            🏷️ Add or remove Product Types.
          </div>
        );
      case "Product Details":
        return (
          <div className="bg-white p-8 rounded-xl shadow-sm">
            📦 View and edit detailed Product Information.
          </div>
        );
      case "Order":
        return (
          <div className="bg-white p-8 rounded-xl shadow-sm">
            🛒 Track and update customer Orders.
          </div>
        );
      case "Home Banner":
        return (
          <div className="bg-white p-8 rounded-xl shadow-sm">
            🖼️ Upload and change Website Banners.
          </div>
        );
      default:
        return <div>Select an option from the sidebar.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col transition-all duration-300">
        {/* Logo / Header Area */}
        <div className="h-20 flex items-center justify-center border-b border-gray-800">
          <h1 className="text-2xl font-bold tracking-wider text-blue-500">
            CRM<span className="text-white">TRADERS</span>
          </h1>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 
                ${
                  activeTab === item.name
                    ? "bg-blue-600 text-white shadow-lg" // Active Tab Styling
                    : "text-gray-400 hover:bg-gray-800 hover:text-white" // Inactive Tab Styling
                }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Logout Button at the bottom */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors duration-200"
          >
            <span className="text-xl">🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white shadow-sm flex items-center justify-between px-8 z-10">
          <h2 className="text-2xl font-semibold text-gray-800">{activeTab}</h2>
        </header>

        {/* Dynamic Content Area (Scrollable) */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
