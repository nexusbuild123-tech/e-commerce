
const ProductCard = ({
  products,
  productsPerPage,
  currentPage,
  setCurrentPage,
  isEditingProduct,
  productForm,
  setProductForm,
  handleSaveProductCard,
  isProductUploading,
  handleProductImageChange,
  resetProductForm,
  handleEditProductClick,
  handleDeleteProductCard,
}) => {
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
            <input
              type="text"
              required
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              placeholder="e.g. Premium Cotton Shirt"
              className="w-full mt-1 px-4 py-2 border rounded-xl text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase">Category</label>
            <input
              type="text"
              required
              value={productForm.category}
              onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
              placeholder="e.g. Clothing, Electronics"
              className="w-full mt-1 px-4 py-2 border rounded-xl text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase">Discount (%)</label>
              <input
                type="number"
                value={productForm.discount}
                onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })}
                placeholder="e.g. 10"
                className="w-full mt-1 px-4 py-2 border rounded-xl text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase">Rating ★</label>
              <input
                type="text"
                required
                value={productForm.rating}
                onChange={(e) => setProductForm({ ...productForm, rating: e.target.value })}
                placeholder="4.5"
                className="w-full mt-1 px-4 py-2 border rounded-xl text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase">Description</label>
            <textarea
              rows="3"
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              placeholder="Product descriptions details..."
              className="w-full mt-1 px-4 py-2 border rounded-xl text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Display Image</label>
            <input
              id="productImageInput"
              type="file"
              accept="image/*"
              onChange={handleProductImageChange}
              className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 cursor-pointer"
            />
          </div>

          {productForm.image && (
            <div className="mt-2 border rounded-xl p-2 bg-gray-50">
              <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Selected Image Preview:</p>
              <img src={productForm.image} alt="Product Preview" className="w-full h-32 object-contain rounded-lg" />
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isProductUploading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-sm transition shadow-md shadow-blue-600/10"
            >
              {isProductUploading ? "Processing..." : isEditingProduct ? "Update Structure" : "Insert Card"}
            </button>
            {isEditingProduct && (
              <button
                type="button"
                onClick={resetProductForm}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-4 py-2.5 rounded-xl text-sm transition"
              >
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
            <p className="text-xs text-gray-400">
              Page {currentPage} of {totalPages || 1} — Showing max {productsPerPage} items per view
            </p>
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
                      <h4 className="font-extrabold text-sm text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {p.name}
                      </h4>
                      <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                        {p.description || "No description provided."}
                      </p>
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
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1.5 rounded-lg border text-xs font-bold text-gray-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              ◀ Prev
            </button>

            <div className="flex items-center gap-1 flex-wrap">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-extrabold transition-all ${
                    currentPage === index + 1
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "border text-gray-600 bg-white hover:bg-slate-50"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-3 py-1.5 rounded-lg border text-xs font-bold text-gray-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next ▶
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;