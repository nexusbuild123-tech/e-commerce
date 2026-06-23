import { useState } from 'react';

const ShopByCategory = ({
  categories,
  fetchCategories,
  categoryForm,
  setCategoryForm,
  isCategoryUploading,
  setIsCategoryUploading,
  isEditingCategory,
  setIsEditingCategory,
  resetCategoryForm,
}) => {
  
  // --- SLIDER / PAGINATION STATES & LOGIC ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Sliding system ke liye 4 cards per view perfect hain

  // Total slides calculate karein
  const totalPages = Math.ceil(categories.length / itemsPerPage) || 1;

  // Safe current page derive karein (deletion safe)
  const activePage = Math.min(currentPage, totalPages);

  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);

  // Auto-generate slug from name input
  const handleNameChange = (e) => {
    const nameVal = e.target.value;
    const slugVal = nameVal
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    
    setCategoryForm((prev) => ({
      ...prev,
      name: nameVal,
      slug: slugVal,
    }));
  };

  // Image File Reader Processor (Base64)
  const handleCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCategoryForm((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save or Update Category Handler
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name || !categoryForm.slug || !categoryForm.image) {
      return alert("All fields (Name, Slug, Image) are required!");
    }

    setIsCategoryUploading(true);
    const url = isEditingCategory
      ? `http://127.0.0.1:5000/admin/update-category/${categoryForm.id}`
      : "http://127.0.0.1:5000/admin/add-category";

    const method = isEditingCategory ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "nexusBuild@123+!",
        },
        body: JSON.stringify({
          name: categoryForm.name,
          slug: categoryForm.slug,
          image: categoryForm.image,
        }),
      });

      if (response.ok) {
        alert(isEditingCategory ? "Category Updated Successfully!" : "Category Added Successfully!");
        resetCategoryForm();
        fetchCategories();
      } else {
        alert("Something went wrong with the category API.");
      }
    } catch (error) {
      console.error("Category operation failed", error);
    } finally {
      setIsCategoryUploading(false);
    }
  };

  // Delete Category Handler
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category permanently?")) return;
    try {
      const response = await fetch(`http://127.0.0.1:5000/admin/delete-category/${id}`, {
        method: "DELETE",
        headers: { "x-api-key": "nexusBuild@123+!" },
      });
      if (response.ok) {
        alert("Category deleted successfully.");
        fetchCategories();
        if (categoryForm.id === id) resetCategoryForm();
      }
    } catch (error) {
      console.error("Error deleting category", error);
    }
  };

  const handleEditClick = (category) => {
    setIsEditingCategory(true);
    setCategoryForm({
      id: category.id,
      name: category.name,
      slug: category.slug,
      image: category.image,
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-800">Shop By Category Management</h2>
        <p className="text-sm text-gray-500 mt-1">Create, update, and manage your storefront product categories.</p>
      </div>

      {/* MAIN SIDE-BY-SIDE SPLIT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: ADD/EDIT FORM */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm sticky top-6">
          <h3 className="text-base font-bold text-gray-700 mb-4">
            {isEditingCategory ? "📝 Edit Existing Category" : "✨ Add New Category"}
          </h3>
          <form onSubmit={handleSaveCategory} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category Name</label>
              <input
                type="text"
                placeholder="e.g. Electronics, Mens Fashion"
                value={categoryForm.name}
                onChange={handleNameChange}
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Slug (URL Path)</label>
              <input
                type="text"
                placeholder="auto-generated-slug"
                value={categoryForm.slug}
                readOnly
                className="w-full px-4 py-2 border bg-gray-50 rounded-xl focus:outline-none text-sm text-gray-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category Image</label>
              <input
                type="file"
                id="categoryImageInput"
                accept="image/*"
                onChange={handleCategoryImageChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {categoryForm.image && (
              <div className="mt-2 bg-gray-50 p-2 rounded-xl border border-dashed flex flex-col items-center justify-center">
                <span className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Live Preview:</span>
                <img src={categoryForm.image} alt="Preview" className="h-20 w-20 object-cover rounded-xl border" />
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={isCategoryUploading}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-md disabled:opacity-50"
              >
                {isCategoryUploading ? "Processing..." : isEditingCategory ? "Update" : "Save Category"}
              </button>
              {isEditingCategory && (
                <button
                  type="button"
                  onClick={resetCategoryForm}
                  className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: SLIDING CARD CAROUSEL SYSTEM */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between h-full min-h-[500px]">
          
          {/* HEADER CONTROL BAR */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div>
              <h3 className="text-base font-bold text-gray-700">Active Categories</h3>
              <p className="text-xs text-gray-400 mt-0.5">Total {categories.length} items loaded</p>
            </div>

            {/* QUICK PREV / NEXT TOP TRIGGERS */}
            {totalPages > 1 && (
              <div className="flex gap-1.5">
                <button
                  onClick={() => setCurrentPage(activePage - 1)}
                  disabled={activePage === 1}
                  className="w-8 h-8 flex items-center justify-center bg-white border rounded-xl shadow-sm text-sm hover:bg-gray-50 disabled:opacity-30 transition"
                >
                  ◀
                </button>
                <button
                  onClick={() => setCurrentPage(activePage + 1)}
                  disabled={activePage === totalPages}
                  className="w-8 h-8 flex items-center justify-center bg-white border rounded-xl shadow-sm text-sm hover:bg-gray-50 disabled:opacity-30 transition"
                >
                  ▶
                </button>
              </div>
            )}
          </div>

          {/* CAROUSEL SLIDER VIEWTRACK */}
          <div className="p-5 flex-1">
            {categories.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-gray-400 italic py-20">
                No categories found in the system store database.
              </div>
            ) : (
              // key={activePage} changes dynamic smooth entry triggers when sliding pages
              <div key={activePage} className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn transition-all duration-300">
                {currentCategories.map((category) => (
                  <div 
                    key={category.id} 
                    className="group relative bg-gray-50/60 hover:bg-white border border-gray-100 hover:border-blue-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    {/* Top Section: Image & Meta */}
                    <div className="flex gap-3 items-start">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-200/80 shrink-0 bg-white shadow-inner">
                        <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="font-extrabold text-gray-800 text-sm truncate">{category.name}</h4>
                        <span className="inline-block bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-[11px] font-mono mt-1 truncate max-w-full">
                          /{category.slug}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action Controls */}
                    <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleEditClick(category)}
                        className="flex-1 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="flex-1 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SLIDER FOOTER NAVIGATION CONTROLS */}
          {totalPages > 1 && (
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
              <span className="text-xs font-bold text-gray-500">
                Slide <span className="text-blue-600">{activePage}</span> of {totalPages}
              </span>

              {/* DOT INDICATORS SYSTEM */}
              <div className="flex gap-1.5 items-center">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activePage === index + 1 ? 'w-6 bg-blue-600' : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* FULL CONTROL BUTTONS */}
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(activePage - 1)}
                  disabled={activePage === 1}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl border bg-white hover:bg-gray-50 text-gray-600 transition disabled:opacity-40"
                >
                  ◀ Previous
                </button>
                <button
                  onClick={() => setCurrentPage(activePage + 1)}
                  disabled={activePage === totalPages}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl border bg-white hover:bg-gray-50 text-gray-600 transition disabled:opacity-40"
                >
                  Next ▶
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default ShopByCategory;