import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const navigate = useNavigate();

  const [banners, setBanners] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [fileData, setFileData] = useState({ name: "", data: "" });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const adminUser = localStorage.getItem("admin_user");
    if (!adminUser) {
      navigate("/admin/login");
    }
  }, [navigate]);

  // Cache buster (?t=...) aur cache: "no-store" add kiya taaki instant update ho
  const fetchBanners = useCallback(async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/banners?t=${Date.now()}`, {
        cache: "no-store"
      });
      const data = await response.json();
      if (data.status === "success") {
        setBanners(data.banners);
      }
    } catch (error) {
      console.error("Failed to fetch banners", error);
    }
  }, []);

  // Ab tab "Dashboard" ho ya "Home Banner", dono cases me banner counts update honge
  useEffect(() => {
    const loadBannersData = async () => {
      if (activeTab === "Home Banner" || activeTab === "Dashboard") {
        await fetchBanners();
      }
    };
    loadBannersData();
  }, [activeTab, fetchBanners]);

  const handleLogout = () => {
    localStorage.removeItem("admin_user");
    navigate("/admin/login");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFileData({ name: file.name, data: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadBanner = async () => {
    if (!fileData.data) return alert("Please select an image first!");
    setIsUploading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/admin/upload-banner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "nexusBuild@123+!",
        },
        body: JSON.stringify({ filename: fileData.name, image_data: fileData.data }),
      });
      if (response.ok) {
        alert("Banner Uploaded!");
        setPreviewImage(null);
        setFileData({ name: "", data: "" });
        document.getElementById("bannerUploadInput").value = "";
        fetchBanners(); // Upload hote hi table refresh hogi
      }
    } catch (error) {
      alert("Error uploading banner.",error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    try {
      const response = await fetch(`http://127.0.0.1:5000/admin/delete-banner/${id}`, {
        method: "DELETE",
        headers: { "x-api-key": "nexusBuild@123+!" },
      });
      if (response.ok) fetchBanners();
    } catch (error) {
      console.error("Error deleting", error);
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: "📊" },
    { name: "Home Banner", icon: "🖼️" },
    { name: "Product Card", icon: "💳" },
    { name: "Product Type", icon: "🏷️" },
    { name: "Product Details", icon: "📦" },
    { name: "Order", icon: "🛒" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard": {
        // FIXED: Pure case ko curly braces {} ke block me wrap kar diya hai lexcial error hatane ke liye
        const statsData = [
          { name: "Home Banner", count: banners.length, icon: "🖼️", bg: "bg-blue-50 text-blue-600 border-blue-200" },
          { name: "Product Card", count: 4, icon: "💳", bg: "bg-green-50 text-green-600 border-green-200" }, 
          { name: "Product Type", count: 8, icon: "🏷️", bg: "bg-purple-50 text-purple-600 border-purple-200" },
          { name: "Product Details", count: 12, icon: "📦", bg: "bg-amber-50 text-amber-600 border-amber-200" },
          { name: "Order", count: 25, icon: "🛒", bg: "bg-rose-50 text-rose-600 border-rose-200" },
        ];

        return (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-gray-800">Welcome to Admin Dashboard</h2>
              <p className="text-sm text-gray-500 mt-1">Here is the quick overview of your CRM store data metrics.</p>
            </div>
            
            {/* STATS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {statsData.map((stat) => (
                <div 
                  key={stat.name}
                  onClick={() => setActiveTab(stat.name)}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex items-center justify-between group"
                >
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.name}</span>
                    <h3 className="text-3xl font-black text-gray-900 mt-2 group-hover:text-blue-600 transition-colors">
                      {stat.count}
                    </h3>
                  </div>
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl border ${stat.bg.split(' ')[0]} ${stat.bg.split(' ')[1]} ${stat.bg.split(' ')[2]}`}>
                    {stat.icon}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case "Home Banner":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
              <h3 className="text-lg font-bold mb-4 border-b pb-2">Upload Banner</h3>
              <input id="bannerUploadInput" type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 cursor-pointer" />
              {previewImage && (
                <div className="mt-6">
                  <p className="text-xs text-gray-500 mb-2">Preview:</p>
                  <img src={previewImage} alt="Preview" className="w-full h-40 object-cover rounded shadow-sm border" />
                  <button onClick={handleUploadBanner} disabled={isUploading} className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition">
                    {isUploading ? "Uploading..." : "Upload Banner"}
                  </button>
                </div>
              )}
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-4 border-b pb-2">Active Banners</h3>
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 text-sm border-b"><th className="pb-3">Image</th><th className="pb-3">Name</th><th className="pb-3 text-right">Action</th></tr>
                </thead>
                <tbody>
                  {banners.map((b) => (
                    <tr key={b.id} className="border-b hover:bg-gray-50">
                      <td className="py-3"><img src={b.image_data} className="w-20 h-10 object-cover rounded shadow-sm" alt="banner" /></td>
                      <td className="py-3 text-sm text-gray-700">{b.filename}</td>
                      <td className="py-3 text-right"><button onClick={() => handleDeleteBanner(b.id)} className="text-red-500 font-semibold text-sm">Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return <div className="text-gray-600 font-semibold bg-white p-6 rounded-xl border">{activeTab} Management View Coming Soon.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="h-20 flex items-center justify-center border-b border-gray-800 font-bold text-xl tracking-wider">CRM TRADERS</div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button key={item.name} onClick={() => setActiveTab(item.name)} className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${activeTab === item.name ? "bg-blue-600 font-bold shadow-lg shadow-blue-600/30" : "hover:bg-gray-800 text-gray-300"}`}>
              <span className="text-lg">{item.icon}</span> {item.name}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-950 hover:text-white rounded-xl transition-colors">🚪 Logout</button>
        </div>
      </aside>
      
      {/* MAIN LAYOUT AREA */}
      <main className="flex-1 overflow-y-auto p-8">{renderContent()}</main>
    </div>
  );
};

export default Dashboard;