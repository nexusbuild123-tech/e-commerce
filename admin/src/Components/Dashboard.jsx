import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import HomeBanner from "./HomeBanner";
import ProductCard from "./ProductCard";
import ManagementPlaceholder from "./ManagementPlaceholder";
import ShopByCategory from "./ShopByCategory"; 
import ProductTypes from "./ProductTypes"; 

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const navigate = useNavigate();

  // --- BANNERS STATES ---
  const [banners, setBanners] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [fileData, setFileData] = useState({ name: "", data: "" });
  const [isUploading, setIsUploading] = useState(false);

  // --- PRODUCT STATES ---
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({
    id: null, name: "", category: "", description: "", discount: "", rating: "4.5", image: ""
  });
  const [isProductUploading, setIsProductUploading] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);

  // --- SHOP CATEGORY STATES ---
  const [categories, setCategories] = useState([]);
  const [categoryForm, setCategoryForm] = useState({ id: null, name: "", slug: "", image: "" });
  const [isCategoryUploading, setIsCategoryUploading] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);

  // --- PRODUCT TYPES STATES ---
  const [productTypes, setProductTypes] = useState([]);
  const [productTypeForm, setProductTypeForm] = useState({ id: null, name: "", slug: "", description: "" });
  const [isProductTypeUploading, setIsProductTypeUploading] = useState(false);
  const [isEditingProductType, setIsEditingProductType] = useState(false);

  // --- PAGINATION STATE ---
  const productsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);

  // Auth Protection Check
  useEffect(() => {
    const adminUser = localStorage.getItem("admin_user");
    if (!adminUser) navigate("/admin/login");
  }, [navigate]);

  // ==========================================
  // FETCH LOGIC DATA LAYERS
  // ==========================================
  const fetchBanners = useCallback(async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/banners?t=${Date.now()}`, { cache: "no-store" });
      const data = await response.json();
      if (data.status === "success") setBanners(data.banners);
    } catch (error) { console.error("Banner fetch failed", error); }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/product-cards?t=${Date.now()}`, { cache: "no-store" });
      const data = await response.json();
      if (data.status === "success") setProducts(data.products);
    } catch (error) { console.error("Products fetch failed", error); }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/categories?t=${Date.now()}`, { cache: "no-store" });
      const data = await response.json();
      if (data.status === "success") setCategories(data.categories);
    } catch (error) { console.error("Categories fetch failed", error); }
  }, []);

  const fetchProductTypes = useCallback(async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/product-types?t=${Date.now()}`, { cache: "no-store" });
      const data = await response.json();
      if (data.status === "success") setProductTypes(data.productTypes);
    } catch (error) { console.error("Product types fetch failed", error); }
  }, []);

  // Multi-Tab Data Sync System
  useEffect(() => {
    const loadBannersData = async () => {
      if (activeTab === "Dashboard") {
        await fetchBanners();
        await fetchProducts();
        await fetchCategories();
        await fetchProductTypes();
      } else if (activeTab === "Home Banner") {
        await fetchBanners();
      } else if (activeTab === "Product Card") {
        await fetchProducts();
        setCurrentPage(1);
      } else if (activeTab === "Shop By Category") {
        await fetchCategories();
      } else if (activeTab === "Product Types") {
        await fetchProductTypes();
      }
    };
    loadBannersData();
  }, [activeTab, fetchBanners, fetchProducts, fetchCategories, fetchProductTypes]);

  const handleLogout = () => {
    localStorage.removeItem("admin_user");
    navigate("/admin/login");
  };

  // ==========================================
  // HOME BANNER HANDLERS
  // ==========================================
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
        headers: { "Content-Type": "application/json", "x-api-key": "nexusBuild@123+!" },
        body: JSON.stringify({ filename: fileData.name, image_data: fileData.data }),
      });
      if (response.ok) {
        alert("Banner Uploaded!");
        setPreviewImage(null);
        setFileData({ name: "", data: "" });
        const input = document.getElementById("bannerUploadInput");
        if (input) input.value = "";
        fetchBanners();
      }
    } catch (error) {
      alert("Error uploading banner.");
      console.error(error);
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
      console.error("Error deleting banner", error);
    }
  };

  // ==========================================
  // PRODUCT CARD OPERATION HANDLERS (RESTORED)
  // ==========================================
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

  const handleSaveProductCard = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.category || !productForm.image) {
      return alert("Name, Category and Image are required fields!");
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
        alert("Something went wrong with the database API transaction.");
      }
    } catch (error) {
      console.error("Product database write failed", error);
    } finally {
      setIsProductUploading(false);
    }
  };

  const handleDeleteProductCard = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product card permanently?")) return;
    try {
      const response = await fetch(`http://127.0.0.1:5000/admin/delete-product-card/${id}`, {
        method: "DELETE",
        headers: { "x-api-key": "nexusBuild@123+!" },
      });
      if (response.ok) {
        alert("Product Card purged from database.");
        fetchProducts();
        if (productForm.id === id) resetProductForm();
      }
    } catch (error) {
      console.error("Error running delete stack on card", error);
    }
  };

  const handleEditProductClick = (product) => {
    setIsEditingProduct(true);
    setProductForm({
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description || "",
      discount: product.discount || "",
      rating: product.rating,
      image: product.image
    });
  };

  // ==========================================
  // FORM RESET CORES
  // ==========================================
  const resetProductForm = () => {
    setIsEditingProduct(false);
    setProductForm({ id: null, name: "", category: "", description: "", discount: "", rating: "4.5", image: "" });
    const fileInput = document.getElementById("productImageInput");
    if (fileInput) fileInput.value = "";
  };

  const resetCategoryForm = () => {
    setIsEditingCategory(false);
    setCategoryForm({ id: null, name: "", slug: "", image: "" });
    const fileInput = document.getElementById("categoryImageInput");
    if (fileInput) fileInput.value = "";
  };

  const resetProductTypeForm = () => {
    setIsEditingProductType(false);
    setProductTypeForm({ id: null, name: "", slug: "", description: "" });
  };

  // Sidebar Menu Map
  const menuItems = [
    { name: "Dashboard", icon: "📊" },
    { name: "Home Banner", icon: "🖼️" },
    { name: "Shop By Category", icon: "🏷️" }, 
    { name: "Product Card", icon: "💳" },
    { name: "Product Types", icon: "🗂️" }, 
    { name: "Product Details", icon: "📦" },
    { name: "Order", icon: "🛒" },
  ];

  // ==========================================
  // VIEW SWITCH RENDER ROUTER
  // ==========================================
  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard": {
        const statsData = [
          { name: "Home Banner", count: banners.length, icon: "🖼️", bg: "bg-blue-50 text-blue-600 border-blue-200" },
          { name: "Shop By Category", count: categories.length, icon: "🏷️", bg: "bg-purple-50 text-purple-600 border-purple-200" },
          { name: "Product Types", count: productTypes.length, icon: "🗂️", bg: "bg-indigo-50 text-indigo-600 border-indigo-200" },
          { name: "Product Card", count: products.length, icon: "💳", bg: "bg-green-50 text-green-600 border-green-200" }, 
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
        return <HomeBanner previewImage={previewImage} handleImageChange={handleImageChange} handleUploadBanner={handleUploadBanner} isUploading={isUploading} banners={banners} handleDeleteBanner={handleDeleteBanner} />;
      
      case "Shop By Category":
        return <ShopByCategory categories={categories} fetchCategories={fetchCategories} categoryForm={categoryForm} setCategoryForm={setCategoryForm} isCategoryUploading={isCategoryUploading} setIsCategoryUploading={setIsCategoryUploading} isEditingCategory={isEditingCategory} setIsEditingCategory={setIsEditingCategory} resetCategoryForm={resetCategoryForm} />;
      
      case "Product Types":
        return (
          <ProductTypes 
            productTypes={productTypes}
            fetchProductTypes={fetchProductTypes}
            productTypeForm={productTypeForm}
            setProductTypeForm={setProductTypeForm}
            isProductTypeUploading={isProductTypeUploading}
            setIsProductTypeUploading={setIsProductTypeUploading}
            isEditingProductType={isEditingProductType}
            setIsEditingProductType={setIsEditingProductType}
            resetProductTypeForm={resetProductTypeForm}
            setActiveTab={setActiveTab} 
          />
        );

      case "Product Card":
        return (
          <ProductCard 
            products={products} 
            productsPerPage={productsPerPage} 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage} 
            isEditingProduct={isEditingProduct} 
            productForm={productForm} 
            setProductForm={setProductForm} 
            handleSaveProductCard={handleSaveProductCard} 
            isProductUploading={isProductUploading} 
            handleProductImageChange={handleProductImageChange} 
            resetProductForm={resetProductForm} 
            handleEditProductClick={handleEditProductClick} 
            handleDeleteProductCard={handleDeleteProductCard} 
          />
        );

      default:
        return <ManagementPlaceholder activeTab={activeTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      {/* MOBILE SIDEBAR BLACK OVERLAY */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity" onClick={() => setIsSidebarOpen(false)} />}
      
      {/* GLOBAL APPLICATION SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white flex flex-col z-50 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static transition-transform duration-300 ease-in-out`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-800 flex-shrink-0">
          <span className="font-black text-xl tracking-wider text-blue-500">CRM TRADERS</span>
          <button className="lg:hidden text-gray-400 hover:text-white text-2xl p-2 focus:outline-none" onClick={() => setIsSidebarOpen(false)}>✕</button>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button key={item.name} onClick={() => { setActiveTab(item.name); setIsSidebarOpen(false); }} className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${activeTab === item.name ? "bg-blue-600 font-bold shadow-lg shadow-blue-600/30" : "hover:bg-gray-800 text-gray-300"}`}>
              <span className="text-lg">{item.icon}</span> {item.name}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800 flex-shrink-0">
          <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-950 hover:text-white rounded-xl transition-colors">🚪 Logout</button>
        </div>
      </aside>

      {/* CORE VIEW LAYOUT SECTION */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* RESPONSIVE MOBILE TOP NAVBAR BAR */}
        <header className="lg:hidden h-16 bg-white border-b flex items-center justify-between px-6 flex-shrink-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="text-gray-700 hover:text-blue-600 text-2xl p-1 focus:outline-none">☰</button>
            <span className="font-black text-lg tracking-wider text-gray-800">CRM TRADERS</span>
          </div>
          <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">{activeTab}</span>
        </header>

        {/* CONTAINER VIEWPORTS PORTAL */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{renderContent()}</main>
      </div>
    </div>
  );
};

export default Dashboard;