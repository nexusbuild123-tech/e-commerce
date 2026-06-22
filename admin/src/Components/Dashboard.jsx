import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state
  const navigate = useNavigate();

  // Banners States
  const [banners, setBanners] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [fileData, setFileData] = useState({ name: "", data: "" });
  const [isUploading, setIsUploading] = useState(false);

  // --- PRODUCT STATES ---
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({
    id: null,
    name: "",
    category: "",
    description: "",
    discount: "",
    rating: "4.5",
    image: ""
  });
  const [isProductUploading, setIsProductUploading] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4; // Ek page par kitne cards dikhane hai

  useEffect(() => {
    const adminUser = localStorage.getItem("admin_user");
    if (!adminUser) {
      navigate("/admin/login");
    }
  }, [navigate]);

  // Fetch Banners
  const fetchBanners = useCallback(async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/banners?t=${Date.now()}`, { cache: "no-store" });
      const data = await response.json();
      if (data.status === "success") setBanners(data.banners);
    } catch (error) {
      console.error("Failed to fetch banners", error);
    }
  }, []);

  // --- FETCH PRODUCTS ---
  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/product-cards?t=${Date.now()}`, { cache: "no-store" });
      const data = await response.json();
      if (data.status === "success") setProducts(data.products);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  }, []);

  // Multi-tab loading trigger
  useEffect(() => {
    const loadBannersData = async () => {
      if (activeTab === "Dashboard") {
        await fetchBanners();
        await fetchProducts();
      } else if (activeTab === "Home Banner") {
        await fetchBanners();
      } else if (activeTab === "Product Card") {
        await fetchProducts();
        setCurrentPage(1); // Tab change hone par page 1 par reset karein
      }
    };
    loadBannersData();
  }, [activeTab, fetchBanners, fetchProducts]);

  const handleLogout = () => {
    localStorage.removeItem("admin_user");
    navigate("/admin/login");
  };

  // Banner image processor
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

  // Product Card image processor
  const handleProductImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm(prev => ({ ...prev, image: reader.result }));
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
        headers: { "Content-Type": "application/json", "x-api-key": "nexusBuild@123+!" },
        body: JSON.stringify({ filename: fileData.name, image_data: fileData.data }),
      });
      if (response.ok) {
        alert("Banner Uploaded!");
        setPreviewImage(null);
        setFileData({ name: "", data: "" });
        document.getElementById("bannerUploadInput").value = "";
        fetchBanners();
      }
    } catch (error) {
      alert("Error uploading banner.", error);
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

  // --- SAVE / UPDATE PRODUCT CARD ---
  const handleSaveProductCard = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.category || !productForm.image) {
      return alert("Name, Category and Image are highly required fields!");
    }

    setIsProductUploading(true);
    const url = isEditingProduct 
      ? `http://127.0.0.1:5000/admin/update-product-card/${productForm.id}` 
      : "http://127.0.0.1:5000/admin/add-product-card";
    
    const method = isEditingProduct ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json", "x-api-key": "nexusBuild@123+!" },
        body: JSON.stringify(productForm),
      });

      if (response.ok) {
        alert(isEditingProduct ? "Product Card Updated Successfully!" : "Product Card Added Successfully!");
        resetProductForm();
        fetchProducts();
      } else {
        alert("Something went wrong with the API database handler.");
      }
    } catch (error) {
      console.error("Product action failed", error);
    } finally {
      setIsProductUploading(false);
    }
  };

  // --- DELETE PRODUCT CARD ---
  const handleDeleteProductCard = async (id) => {
    if (!window.confirm("Are you sure you want to purge this product card permanently?")) return;
    try {
      const response = await fetch(`http://127.0.0.1:5000/admin/delete-product-card/${id}`, {
        method: "DELETE",
        headers: { "x-api-key": "nexusBuild@123+!" },
      });
      if (response.ok) {
        alert("Product Card erased from DB.");
        fetchProducts();
        if(productForm.id === id) resetProductForm();
        const updatedTotalPages = Math.ceil((products.length - 1) / productsPerPage);
        if (currentPage > updatedTotalPages && updatedTotalPages > 0) {
          setCurrentPage(updatedTotalPages);
        }
      }
    } catch (error) {
      console.error("Error deleting product card", error);
    }
  };

  const handleEditProductClick = (product) => {
    setIsEditingProduct(true);
    setProductForm({
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description,
      discount: product.discount || "",
      rating: product.rating,
      image: product.image
    });
  };

  const resetProductForm = () => {
    setIsEditingProduct(false);
    setProductForm({ id: null, name: "", category: "", description: "", discount: "", rating: "4.5", image: "" });
    const fileInput = document.getElementById("productImageInput");
    if (fileInput) fileInput.value = "";
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
        const statsData = [
          { name: "Home Banner", count: banners.length, icon: "🖼️", bg: "bg-blue-50 text-blue-600 border-blue-200" },
          { name: "Product Card", count: products.length, icon: "💳", bg: "bg-green-50 text-green-600 border-green-200" }, 
          { name: "Product Type", count: 8, icon: "🏷️", bg: "bg-purple-50 text-purple-600 border-purple-200" },
          { name: "Product Details", count: 12, icon: "📦", bg: "bg-amber-50 text-amber-600 border-amber-200" },
          { name: "Order", count: 25, icon: "🛒", bg: "bg-rose-50 text-rose-600 border-rose-200" },
        ];

        return (
          <div>
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-800">Welcome to Admin Dashboard</h2>
              <p className="text-sm text-gray-500 mt-1">Here is the quick overview of your CRM store data metrics.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {statsData.map((stat) => (
                <div 
                  key={stat.name}
                  onClick={() => { setActiveTab(stat.name); setIsSidebarOpen(false); }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex items-center justify-between group"
                >
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.name}</span>
                    <h3 className="text-2xl md:text-3xl font-black text-gray-900 mt-2 group-hover:text-blue-600 transition-colors">{stat.count}</h3>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
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
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
              <h3 className="text-lg font-bold mb-4 border-b pb-2">Active Banners</h3>
              <table className="w-full text-left min-w-[400px]">
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

      case "Product Card": {
        const totalPages = Math.ceil(products.length / productsPerPage);
        const indexOfLastProduct = currentPage * productsPerPage;
        const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
        const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
            {/* CONTROL FORM */}
            <div className="lg:col-span-1 bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 h-fit w-full">
              <h3 className="text-lg font-black text-gray-800 mb-4 border-b pb-2">
                {isEditingProduct ? "✏️ Edit Product Card" : "➕ Add Product Card"}
              </h3>
              <form onSubmit={handleSaveProductCard} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase">Product Name</label>
                  <input type="text" required value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} placeholder="e.g. Premium Cotton Shirt" className="w-full mt-1 px-4 py-2 border rounded-xl text-sm outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase">Category</label>
                  <input type="text" required value={productForm.category} onChange={(e) => setProductForm({...productForm, category: e.target.value})} placeholder="e.g. Clothing, Electronics" className="w-full mt-1 px-4 py-2 border rounded-xl text-sm outline-none focus:border-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase">Discount (%)</label>
                    <input type="number" value={productForm.discount} onChange={(e) => setProductForm({...productForm, discount: e.target.value})} placeholder="e.g. 10" className="w-full mt-1 px-4 py-2 border rounded-xl text-sm outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase">Rating ★</label>
                    <input type="text" required value={productForm.rating} onChange={(e) => setProductForm({...productForm, rating: e.target.value})} placeholder="4.5" className="w-full mt-1 px-4 py-2 border rounded-xl text-sm outline-none focus:border-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase">Description</label>
                  <textarea rows="3" value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} placeholder="Product descriptions details..." className="w-full mt-1 px-4 py-2 border rounded-xl text-sm outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Display Image</label>
                  <input id="productImageInput" type="file" accept="image/*" onChange={handleProductImageChange} className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 cursor-pointer" />
                </div>
                
                {productForm.image && (
                  <div className="mt-2 border rounded-xl p-2 bg-gray-50">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Selected Image Preview:</p>
                    <img src={productForm.image} alt="Product Preview" className="w-full h-32 object-contain rounded-lg" />
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button type="submit" disabled={isProductUploading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-sm transition shadow-md shadow-blue-600/10">
                    {isProductUploading ? "Processing..." : isEditingProduct ? "Update Structure" : "Insert Card"}
                  </button>
                  {isEditingProduct && (
                    <button type="button" onClick={resetProductForm} className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-4 py-2.5 rounded-xl text-sm transition">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* LIVE DATA PRODUCT - MODERN PAGINATED GRID SYSTEM */}
            <div className="lg:col-span-2 w-full flex flex-col justify-between lg:h-full gap-6">
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-black text-gray-800">Active Product Cards</h3>
                  <p className="text-xs text-gray-400">Page {currentPage} of {totalPages || 1} — Showing max {productsPerPage} items per view</p>
                </div>
                
                {/* Grid Wrapper */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {currentProducts.length === 0 ? (
                    <div className="col-span-full bg-white text-center py-12 rounded-2xl border border-dashed border-gray-200 font-semibold text-gray-400 px-4">
                      📦 No active products inside this page view.
                    </div>
                  ) : (
                    currentProducts.map((p) => (
                      <div 
                        key={p.id} 
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between overflow-hidden relative group"
                      >
                        {/* Badges */}
                        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                          <span className="text-[10px] font-black bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {p.category}
                          </span>
                          {p.discount && (
                            <span className="text-[10px] font-black bg-red-500 text-white px-2.5 py-1 rounded-full w-fit">
                              🔥 {p.discount}% OFF
                            </span>
                          )}
                        </div>

                        <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm shadow-sm px-2 py-0.5 rounded-lg text-xs font-bold text-amber-500 flex items-center gap-0.5">
                          ⭐ {p.rating}
                        </div>

                        {/* Image */}
                        <div className="w-full h-40 bg-slate-50 flex items-center justify-center p-4 border-b border-gray-50/60 overflow-hidden">
                          <img 
                            src={p.image} 
                            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-102" 
                            alt={p.name} 
                          />
                        </div>

                        {/* Details */}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div className="mb-3">
                            <h4 className="font-extrabold text-sm text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{p.name}</h4>
                            <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">{p.description || "No description provided."}</p>
                          </div>

                          {/* Actions Row */}
                          <div className="grid grid-cols-2 gap-2 border-t pt-3 mt-1">
                            <button 
                              onClick={() => handleEditProductClick(p)} 
                              className="flex items-center justify-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-bold text-xs py-2 rounded-xl transition-all"
                            >
                              ✏️ Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteProductCard(p.id)} 
                              className="flex items-center justify-center gap-1 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white font-bold text-xs py-2 rounded-xl transition-all"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* --- PAGINATION CONTROLS --- */}
              {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm w-full">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="px-3 py-1.5 rounded-lg border text-xs font-bold text-gray-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    ◀ Prev
                  </button>

                  <div className="flex items-center gap-1 flex-wrap">
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`w-8 h-8 rounded-lg text-xs font-extrabold transition-all ${currentPage === index + 1 ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" : "border text-gray-600 bg-white hover:bg-slate-50"}`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>

                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="px-3 py-1.5 rounded-lg border text-xs font-bold text-gray-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Next ▶
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      }

      default:
        return <div className="text-gray-600 font-semibold bg-white p-6 rounded-xl border">{activeTab} Management View Coming Soon.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      
      {/* MOBILE BACKDROP OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-gray-900 text-white flex flex-col z-50 
        transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:static transition-transform duration-300 ease-in-out
      `}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-800 flex-shrink-0">
          <span className="font-black text-xl tracking-wider text-blue-500">CRM TRADERS</span>
          {/* Enhanced Cross Button with better touch padding */}
          <button 
            className="lg:hidden text-gray-400 hover:text-white text-2xl p-2 focus:outline-none" 
            onClick={() => setIsSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button 
              key={item.name} 
              onClick={() => {
                setActiveTab(item.name);
                setIsSidebarOpen(false);
              }} 
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${activeTab === item.name ? "bg-blue-600 font-bold shadow-lg shadow-blue-600/30" : "hover:bg-gray-800 text-gray-300"}`}
            >
              <span className="text-lg">{item.icon}</span> {item.name}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800 flex-shrink-0">
          <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-950 hover:text-white rounded-xl transition-colors">🚪 Logout</button>
        </div>
      </aside>
      
      {/* MAIN LAYOUT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* RESPONSIVE MOBILE HEADER */}
        <header className="lg:hidden h-16 bg-white border-b flex items-center justify-between px-6 flex-shrink-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="text-gray-700 hover:text-blue-600 text-2xl p-1 focus:outline-none"
            >
              ☰
            </button>
            <span className="font-black text-lg tracking-wider text-gray-800">CRM TRADERS</span>
          </div>
          <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">{activeTab}</span>
        </header>

        {/* VIEW CONTAINER */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderContent()}
        </main>
      </div>

    </div>
  );
};

export default Dashboard;