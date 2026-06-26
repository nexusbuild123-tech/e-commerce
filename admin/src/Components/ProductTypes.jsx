import { useState, useEffect } from 'react';

const apiUrl = import.meta.env.VITE_API_URL;

// -------- Strict Base64 Validator ----------
const isValidImageData = (url) => {
  if (!url || typeof url !== 'string') return false;
  if (!url.startsWith('data:image/')) return false;

  const base64Part = url.split(',')[1];
  if (!base64Part) return false;

  // Minimum length for a real image
  if (base64Part.length < 100) return false;

  // Base64 length must be multiple of 4
  if (base64Part.length % 4 !== 0) return false;

  // Only valid base64 characters
  if (!/^[A-Za-z0-9+/=]+$/.test(base64Part)) return false;

  // Padding can only be '=' at the end, max 2
  const padding = base64Part.match(/=+$/);
  if (padding && padding[0].length > 2) return false;

  // Test decode a chunk
  try {
    atob(base64Part.substring(0, 100));
    return true;
  } catch {
    return false;
  }
};

// ---------- Component ----------
const ProductTypes = ({
  productTypes,
  fetchProductTypes,
  productTypeForm,
  setProductTypeForm,
  isProductTypeUploading,
  setIsProductTypeUploading,
  isEditingProductType,
  setIsEditingProductType,
  resetProductTypeForm,
  setActiveTab
}) => {
  
  // --- SLIDER PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // --- Fetch categories & product cards for dropdowns ---
  const [categories, setCategories] = useState([]);
  const [productCards, setProductCards] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catRes, cardRes] = await Promise.all([
          fetch(`${apiUrl}/categories`),
          fetch(`${apiUrl}/product-cards`)
        ]);
        const catData = await catRes.json();
        const cardData = await cardRes.json();
        if (catData.status === 'success') setCategories(catData.categories);
        if (cardData.status === 'success') setProductCards(cardData.products);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };
    fetchOptions();
  }, []);

  // --- Pagination ---
  const totalPages = Math.ceil(productTypes.length / itemsPerPage) || 1;
  const activePage = Math.min(currentPage, totalPages);
  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTypes = productTypes.slice(indexOfFirstItem, indexOfLastItem);

  // --- Auto-generate slug ---
  const handleNameChange = (e) => {
    const nameVal = e.target.value;
    const slugVal = nameVal
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    
    setProductTypeForm((prev) => ({
      ...prev,
      name: nameVal,
      slug: slugVal,
    }));
  };

  // --- Handle image file selection ---
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB. Please compress your image.');
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductTypeForm(prev => ({ ...prev, image: reader.result }));
      };
      reader.onerror = () => {
        alert('Failed to read the image file. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Remove image from form ---
  const handleRemoveImage = () => {
    setProductTypeForm(prev => ({ ...prev, image: '' }));
    const input = document.getElementById('imageUploadInput');
    if (input) input.value = '';
  };

  // --- Save / Update ---
  const handleSaveProductType = async (e) => {
    e.preventDefault();
    if (!productTypeForm.name || !productTypeForm.slug) {
      return alert("Product Type Name and Slug are mandatory parameters!");
    }

    setIsProductTypeUploading(true);
    const url = isEditingProductType
      ? `${apiUrl}/admin/update-product-type/${productTypeForm.id}`
      : `${apiUrl}/admin/add-product-type`;

    const method = isEditingProductType ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "nexusBuild@123+!",
        },
        body: JSON.stringify({
          name: productTypeForm.name,
          slug: productTypeForm.slug,
          description: productTypeForm.description,
          category_id: productTypeForm.category_id || null,
          product_card_id: productTypeForm.product_card_id || null,
          image: productTypeForm.image || null,
          price: productTypeForm.price || null,
          discount: productTypeForm.discount || null,
          rating: productTypeForm.rating || null,
        }),
      });

      if (response.ok) {
        alert(isEditingProductType ? "Product Type Updated!" : "Product Type Added Successfully!");
        resetProductTypeForm();
        fetchProductTypes();
      } else {
        let errorMsg = "Failed execution query schema parameters.";
        try {
          const errorData = await response.json();
          if (errorData.message) errorMsg = errorData.message;
        } catch {
          // ignore
        }
        alert(errorMsg);
      }
    } catch (error) {
      console.error("Action error recorded", error);
    } finally {
      setIsProductTypeUploading(false);
    }
  };

  // --- Delete ---
  const handleDeleteProductType = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product type permanently?")) return;
    try {
      const response = await fetch(`${apiUrl}/admin/delete-product-type/${id}`, {
        method: "DELETE",
        headers: { "x-api-key": "nexusBuild@123+!" },
      });
      if (response.ok) {
        alert("Product Type structure drop executed.");
        fetchProductTypes();
        if (productTypeForm.id === id) resetProductTypeForm();
      }
    } catch (error) {
      console.error("Delete call request failure:", error);
    }
  };

  // --- Edit click ---
  const handleEditClick = (type) => {
    setIsEditingProductType(true);
    setProductTypeForm({
      id: type.id,
      name: type.name,
      slug: type.slug,
      description: type.description || "",
      category_id: type.category_id || "",
      product_card_id: type.product_card_id || "",
      image: type.image || "",
      price: type.price || "",
      discount: type.discount || "",
      rating: type.rating || "",
    });
  };

  // ---------- Helper to render image safely ----------
  const renderSafeImage = (imageSrc, altText, className = "h-12 w-12 object-cover rounded border") => {
    if (isValidImageData(imageSrc)) {
      return (
        <img
          src={imageSrc}
          alt={altText}
          className={className}
          onError={(e) => {
            e.target.style.display = 'none';
            const parent = e.target.parentNode;
            if (parent) {
              const fallback = document.createElement('div');
              fallback.className = `${className} bg-gray-200 flex items-center justify-center text-gray-400 text-xs`;
              fallback.textContent = 'No img';
              parent.appendChild(fallback);
            }
          }}
        />
      );
    }
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center text-gray-400 text-xs`}>
        No img
      </div>
    );
  };

  // ---------- Render ----------
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-800">Product Types Management</h2>
        <p className="text-sm text-gray-500 mt-1">Configure structural product attributes and linking mapping nodes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT FORM */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm sticky top-6">
          <h3 className="text-base font-bold text-gray-700 mb-4">
            {isEditingProductType ? "📝 Modify Product Type" : "✨ Create New Type Node"}
          </h3>
          <form onSubmit={handleSaveProductType} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type Name</label>
              <input
                type="text"
                placeholder="e.g. Branded Attire, Organic Foods"
                value={productTypeForm.name}
                onChange={handleNameChange}
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Slug Routing URL</label>
              <input
                type="text"
                placeholder="auto-generated-path"
                value={productTypeForm.slug}
                readOnly
                className="w-full px-4 py-2 border bg-gray-50 rounded-xl focus:outline-none text-sm text-gray-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description / Spec Details</label>
              <textarea
                rows="3"
                placeholder="Add summary notes regarding metadata properties structure..."
                value={productTypeForm.description}
                onChange={(e) => setProductTypeForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image</label>
              <div className="flex items-center gap-2">
                <input
                  id="imageUploadInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {productTypeForm.image && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-xl text-sm font-bold hover:bg-red-200 transition"
                  >
                    ✕
                  </button>
                )}
              </div>
              {productTypeForm.image && (
                <div className="mt-2">
                  {renderSafeImage(productTypeForm.image, 'Preview', 'h-16 w-16 object-cover rounded border')}
                </div>
              )}
            </div>

            {/* NEW FIELDS: Price, Discount, Rating */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={productTypeForm.price || ''}
                  onChange={(e) => setProductTypeForm(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Discount (%)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={productTypeForm.discount || ''}
                  onChange={(e) => setProductTypeForm(prev => ({ ...prev, discount: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rating (1-5)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                placeholder="4.5"
                value={productTypeForm.rating || ''}
                onChange={(e) => setProductTypeForm(prev => ({ ...prev, rating: e.target.value }))}
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Shop Category Dropdown */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Shop Category</label>
              <select
                value={productTypeForm.category_id || ""}
                onChange={(e) => setProductTypeForm(prev => ({ ...prev, category_id: e.target.value }))}
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">-- None --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Product Card Dropdown */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Associated Product Card</label>
              <select
                value={productTypeForm.product_card_id || ""}
                onChange={(e) => setProductTypeForm(prev => ({ ...prev, product_card_id: e.target.value }))}
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">-- None --</option>
                {productCards.map(card => (
                  <option key={card.id} value={card.id}>{card.name}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={isProductTypeUploading}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-md disabled:opacity-50"
              >
                {isProductTypeUploading ? "Saving Data..." : isEditingProductType ? "Update Parameters" : "Save Node"}
              </button>
              {isEditingProductType && (
                <button
                  type="button"
                  onClick={resetProductTypeForm}
                  className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: LISTINGS */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between min-h-[500px]">
          
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div>
              <h3 className="text-base font-bold text-gray-700">Active Structural Types</h3>
              <p className="text-xs text-gray-400 mt-0.5">Linked directly inside product metadata nodes</p>
            </div>
            {totalPages > 1 && (
              <div className="flex gap-1">
                <button onClick={() => setCurrentPage(activePage - 1)} disabled={activePage === 1} className="w-8 h-8 flex items-center justify-center bg-white border rounded-xl shadow-sm hover:bg-gray-50 disabled:opacity-30">◀</button>
                <button onClick={() => setCurrentPage(activePage + 1)} disabled={activePage === totalPages} className="w-8 h-8 flex items-center justify-center bg-white border rounded-xl shadow-sm hover:bg-gray-50 disabled:opacity-30">▶</button>
              </div>
            )}
          </div>

          <div className="p-5 flex-1">
            {productTypes.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-gray-400 italic py-20">
                No active operational product types configured yet.
              </div>
            ) : (
              <div key={activePage} className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn transition-all duration-300">
                {currentTypes.map((type) => (
                  <div key={type.id} className="group bg-gray-50/60 hover:bg-white border border-gray-100 hover:border-blue-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-extrabold text-gray-800 text-sm truncate">{type.name}</h4>
                        <span className="bg-indigo-50 text-indigo-600 font-mono text-[10px] px-2 py-0.5 rounded-md">ID: {type.id}</span>
                      </div>
                      <div className="mt-1">
                        {renderSafeImage(type.image, type.name)}
                      </div>
                      <p className="text-xs text-gray-400 mt-1 font-mono bg-white px-2 py-0.5 rounded border border-gray-100 inline-block max-w-full truncate">
                        slug: {type.slug}
                      </p>
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2 h-8 italic">
                        {type.description || "No specific design context structural details appended."}
                      </p>
                      {/* Display new fields */}
                      <div className="mt-1 flex flex-wrap gap-1 text-xs">
                        {type.price && <span className="inline-block bg-green-50 text-green-700 px-2 py-0.5 rounded">₹{type.price}</span>}
                        {type.discount && <span className="inline-block bg-red-50 text-red-600 px-2 py-0.5 rounded">{type.discount}% off</span>}
                        {type.rating && <span className="inline-block bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded">⭐ {type.rating}</span>}
                      </div>
                      <div className="mt-1 text-xs text-gray-500 space-x-2">
                        {type.category_name && <span className="inline-block bg-blue-50 px-2 py-0.5 rounded">Cat: {type.category_name}</span>}
                        {type.product_card_name && <span className="inline-block bg-green-50 px-2 py-0.5 rounded">Prod: {type.product_card_name}</span>}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                      <button
                        onClick={() => setActiveTab("Product Details")}
                        className="w-full py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5"
                      >
                        📦 Open Product Details
                      </button>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditClick(type)} className="flex-1 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-bold transition">✏️ Edit</button>
                        <button onClick={() => handleDeleteProductType(type.id)} className="flex-1 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition">🗑️ Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500">Slide <span className="text-blue-600">{activePage}</span> of {totalPages}</span>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i} onClick={() => setCurrentPage(i + 1)} className={`h-2 rounded-full transition-all duration-300 ${activePage === i + 1 ? 'w-6 bg-blue-600' : 'w-2 bg-gray-300'}`} />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProductTypes;