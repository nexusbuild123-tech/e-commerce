import { useState } from 'react';

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
  
  // --- SLIDER PAGINATION FOR RIGHSIDE CARDS ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; 

  const totalPages = Math.ceil(productTypes.length / itemsPerPage) || 1;
  const activePage = Math.min(currentPage, totalPages);

  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTypes = productTypes.slice(indexOfFirstItem, indexOfLastItem);

  // Auto-generate slug handler
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

  // Submit / Update Processing handler
  const handleSaveProductType = async (e) => {
    e.preventDefault();
    if (!productTypeForm.name || !productTypeForm.slug) {
      return alert("Product Type Name and Slug are mandatory parameters!");
    }

    setIsProductTypeUploading(true);
    const url = isEditingProductType
      ? `http://127.0.0.1:5000/admin/update-product-type/${productTypeForm.id}`
      : "http://127.0.0.1:5000/admin/add-product-type";

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
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(isEditingProductType ? "Product Type Updated!" : "Product Type Added Successfully!");
        resetProductTypeForm();
        fetchProductTypes();
      } else {
        alert(data.message || "Failed execution query schema parameters.");
      }
    } catch (error) {
      console.error("Action error recorded", error);
    } finally {
      setIsProductTypeUploading(false);
    }
  };

  // Delete Action handling
  const handleDeleteProductType = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product type permanently?")) return;
    try {
      const response = await fetch(`http://127.0.0.1:5000/admin/delete-product-type/${id}`, {
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

  const handleEditClick = (type) => {
    setIsEditingProductType(true);
    setProductTypeForm({
      id: type.id,
      name: type.name,
      slug: type.slug,
      description: type.description || "",
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER META */}
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-800">Product Types Management</h2>
        <p className="text-sm text-gray-500 mt-1">Configure structural product attributes and linking mapping nodes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COMPONENT COLUMN: ENTRY FORM CONTAINER */}
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

        {/* RIGHT COLUMN: SLIDING VIEWPORTS LISTINGS */}
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
                      <p className="text-xs text-gray-400 mt-1 font-mono bg-white px-2 py-0.5 rounded border border-gray-100 inline-block max-w-full truncate">
                        slug: {type.slug}
                      </p>
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2 h-8 italic">
                        {type.description || "No specific design context structural details appended."}
                      </p>
                    </div>

                    {/* REDIRECTS TO PRODUCT DETAILS ON SPECIFIC TRIGGER TARGET LINK */}
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

          {/* INDICATOR FOOTERS FOOT BAR */}
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