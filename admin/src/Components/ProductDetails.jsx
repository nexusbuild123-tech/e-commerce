import { useState, useEffect, useCallback, useMemo } from 'react';

const apiUrl = import.meta.env.VITE_API_URL;

const ProductDetails = () => {
    // --- State for Product Types ---
    const [productTypes, setProductTypes] = useState([]);
    const [selectedTypeId, setSelectedTypeId] = useState('');
    const [loading, setLoading] = useState(false);
    const [updatingSpecs, setUpdatingSpecs] = useState(false);

    // --- Color Variants ---
    const [variants, setVariants] = useState([]);
    const [formData, setFormData] = useState({
        id: null,
        product_type_id: '',
        color_name: '',
        color_hex: '#000000',
        image: '',
        is_available: true
    });
    const [isEditing, setIsEditing] = useState(false);
    const [imagePreview, setImagePreview] = useState('');

    // --- Gallery Images ---
    const [gallery, setGallery] = useState([]);
    const [galleryImage, setGalleryImage] = useState(null);
    const [galleryPreview, setGalleryPreview] = useState('');
    const [uploadingGallery, setUploadingGallery] = useState(false);

    // --- Derive specifications from productTypes and selectedTypeId ---
    const specifications = useMemo(() => {
        const found = productTypes.find(pt => pt.id == selectedTypeId);
        return found?.specifications || '';
    }, [productTypes, selectedTypeId]);

    // --- Fetch product types ---
    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const res = await fetch(`${apiUrl}/product-types`);
                const data = await res.json();
                if (data.status === 'success') {
                    setProductTypes(data.productTypes);
                    if (data.productTypes.length > 0) {
                        const first = data.productTypes[0];
                        setSelectedTypeId(first.id);
                    }
                }
            } catch (error) {
                console.error('Error fetching product types:', error);
            }
        };
        fetchTypes();
    }, []);

    // --- Fetch color variants ---
    const fetchVariants = useCallback(async (typeId) => {
        if (!typeId) return;
        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/product-color-variants/${typeId}`);
            const data = await res.json();
            if (data.status === 'success') {
                setVariants(data.variants);
            }
        } catch (error) {
            console.error('Error fetching variants:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // --- Fetch gallery images ---
    const fetchGallery = useCallback(async (typeId) => {
        if (!typeId) return;
        try {
            const res = await fetch(`${apiUrl}/product-type-gallery/${typeId}`);
            const data = await res.json();
            if (data.status === 'success') {
                setGallery(data.images);
            }
        } catch (error) {
            console.error('Error fetching gallery:', error);
        }
    }, []);

    // Fetch data when selected type changes
    useEffect(() => {
        if (selectedTypeId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchVariants(selectedTypeId);
           
            fetchGallery(selectedTypeId);
        }
    }, [selectedTypeId, fetchVariants, fetchGallery]);

    // --- Update specifications ---
    const handleUpdateSpecifications = async () => {
        if (!selectedTypeId) return;
        setUpdatingSpecs(true);
        try {
            const found = productTypes.find(pt => pt.id == selectedTypeId);
            if (!found) return;
            const res = await fetch(`${apiUrl}/admin/update-product-type/${selectedTypeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'nexusBuild@123+!'
                },
                body: JSON.stringify({
                    specifications: specifications,
                    name: found.name || '',
                    slug: found.slug || '',
                    description: found.description || '',
                    category_id: found.category_id || null,
                    product_card_id: found.product_card_id || null,
                    image: found.image || null,
                    price: found.price || null,
                    discount: found.discount || null,
                    rating: found.rating || null,
                })
            });
            if (res.ok) {
                alert('Specifications updated successfully!');
                // Refresh product types to reflect changes
                const typeRes = await fetch(`${apiUrl}/product-types`);
                const typeData = await typeRes.json();
                if (typeData.status === 'success') {
                    setProductTypes(typeData.productTypes);
                }
            } else {
                alert('Failed to update specifications.');
            }
        } catch (error) {
            console.error('Error updating specs:', error);
        } finally {
            setUpdatingSpecs(false);
        }
    };

    // --- Color variant handlers ---
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Image must be less than 5MB');
                e.target.value = '';
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setFormData({ id: null, product_type_id: selectedTypeId, color_name: '', color_hex: '#000000', image: '', is_available: true });
        setIsEditing(false);
        setImagePreview('');
        const input = document.getElementById('variantImageInput');
        if (input) input.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.color_name || !formData.color_hex) {
            alert('Color name and hex are required!');
            return;
        }
        const payload = {
            product_type_id: selectedTypeId,
            color_name: formData.color_name,
            color_hex: formData.color_hex,
            image: formData.image || null,
            is_available: formData.is_available
        };

        const url = isEditing
            ? `${apiUrl}/admin/product-color-variants/${formData.id}`
            : `${apiUrl}/admin/product-color-variants`;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'nexusBuild@123+!'
                },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok) {
                alert(isEditing ? 'Variant updated!' : 'Variant added!');
                resetForm();
                fetchVariants(selectedTypeId);
            } else {
                alert(data.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Error saving variant:', error);
        }
    };

    const handleEdit = (variant) => {
        setIsEditing(true);
        setFormData({
            id: variant.id,
            product_type_id: variant.product_type_id,
            color_name: variant.color_name,
            color_hex: variant.color_hex,
            image: variant.image || '',
            is_available: variant.is_available !== undefined ? variant.is_available : true
        });
        setImagePreview(variant.image || '');
    };

    const handleDeleteVariant = async (id) => {
        if (!window.confirm('Delete this color variant?')) return;
        try {
            const res = await fetch(`${apiUrl}/admin/product-color-variants/${id}`, {
                method: 'DELETE',
                headers: { 'x-api-key': 'nexusBuild@123+!' }
            });
            if (res.ok) {
                alert('Variant deleted!');
                fetchVariants(selectedTypeId);
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    // --- Gallery handlers ---
    const handleGalleryImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Image must be less than 5MB');
                e.target.value = '';
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setGalleryPreview(reader.result);
                setGalleryImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadGallery = async () => {
        if (!galleryImage) {
            alert('Please select an image first!');
            return;
        }
        setUploadingGallery(true);
        try {
            const res = await fetch(`${apiUrl}/admin/product-type-gallery`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'nexusBuild@123+!'
                },
                body: JSON.stringify({
                    product_type_id: selectedTypeId,
                    image: galleryImage
                })
            });
            const data = await res.json();
            if (res.ok) {
                alert('Gallery image added!');
                setGalleryImage(null);
                setGalleryPreview('');
                const input = document.getElementById('galleryImageInput');
                if (input) input.value = '';
                fetchGallery(selectedTypeId);
            } else {
                alert(data.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setUploadingGallery(false);
        }
    };

    const handleDeleteGallery = async (id) => {
        if (!window.confirm('Delete this gallery image?')) return;
        try {
            const res = await fetch(`${apiUrl}/admin/product-type-gallery/${id}`, {
                method: 'DELETE',
                headers: { 'x-api-key': 'nexusBuild@123+!' }
            });
            if (res.ok) {
                alert('Gallery image deleted!');
                fetchGallery(selectedTypeId);
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    // --- Render ---
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-gray-800">Product Details – Manage Variants, Gallery & Specifications</h2>
                <p className="text-sm text-gray-500 mt-1">Add color options, extra images, and product specifications.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left: Select Product Type & Specifications */}
                <div className="lg:col-span-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Product Type</label>
                    <select
                        value={selectedTypeId}
                        onChange={(e) => setSelectedTypeId(e.target.value)}
                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                        {productTypes.map(pt => (
                            <option key={pt.id} value={pt.id}>{pt.name}</option>
                        ))}
                    </select>

                    {/* Specifications Section */}
                    <div className="mt-4 bg-white p-3 rounded-xl border border-gray-100">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Specifications</label>
                        <textarea
                            rows="5"
                            placeholder="Enter product specifications (e.g., Brand, Model, Battery, etc.)"
                            value={specifications}
                            onChange={(e) => {
                                const updated = productTypes.map(pt => 
                                    pt.id == selectedTypeId ? { ...pt, specifications: e.target.value } : pt
                                );
                                setProductTypes(updated);
                            }}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <button
                            onClick={handleUpdateSpecifications}
                            disabled={updatingSpecs}
                            className="mt-2 w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition disabled:opacity-50"
                        >
                            {updatingSpecs ? 'Saving...' : 'Update Specifications'}
                        </button>
                    </div>
                </div>

                {/* Middle: Color Variants Form */}
                <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-base font-bold text-gray-700 mb-4">
                        {isEditing ? '✏️ Edit Variant' : '➕ Add New Variant'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Color Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Midnight Black"
                                value={formData.color_name}
                                onChange={(e) => setFormData(prev => ({ ...prev, color_name: e.target.value }))}
                                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hex Code</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={formData.color_hex}
                                    onChange={(e) => setFormData(prev => ({ ...prev, color_hex: e.target.value }))}
                                    className="w-12 h-12 border rounded-xl cursor-pointer"
                                />
                                <input
                                    type="text"
                                    placeholder="#1f2937"
                                    value={formData.color_hex}
                                    onChange={(e) => setFormData(prev => ({ ...prev, color_hex: e.target.value }))}
                                    className="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Variant Image</label>
                            <input
                                id="variantImageInput"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full px-4 py-2 border rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {imagePreview && (
                                <div className="mt-2">
                                    <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded border" />
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="text-xs font-bold text-gray-500 uppercase">Available</label>
                            <input
                                type="checkbox"
                                checked={formData.is_available !== false}
                                onChange={(e) => setFormData(prev => ({ ...prev, is_available: e.target.checked }))}
                                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-500">
                                {formData.is_available !== false ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-md"
                            >
                                {isEditing ? 'Update Variant' : 'Add Variant'}
                            </button>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Color Variants List */}
                    <div className="mt-6 border-t pt-4">
                        <h4 className="text-sm font-bold text-gray-700 mb-3">Existing Variants</h4>
                        {loading ? (
                            <p className="text-sm text-gray-400">Loading...</p>
                        ) : variants.length === 0 ? (
                            <p className="text-sm text-gray-400 italic">No variants added yet.</p>
                        ) : (
                            <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                {variants.map(v => (
                                    <div key={v.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full border" style={{ backgroundColor: v.color_hex }} />
                                            <span className="text-sm font-medium">{v.color_name}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${v.is_available !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {v.is_available !== false ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(v)} className="px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs">✏️</button>
                                            <button onClick={() => handleDeleteVariant(v.id)} className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs">🗑️</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Gallery Management */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h3 className="text-base font-bold text-gray-700 mb-4">🖼️ Gallery Images</h3>
                    <p className="text-xs text-gray-400 mb-3">Upload extra images for this product type. The default image from the product type will always be first.</p>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Add Image</label>
                            <input
                                id="galleryImageInput"
                                type="file"
                                accept="image/*"
                                onChange={handleGalleryImageChange}
                                className="w-full px-4 py-2 border rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {galleryPreview && (
                                <div className="mt-2">
                                    <img src={galleryPreview} alt="Preview" className="h-16 w-16 object-cover rounded border" />
                                </div>
                            )}
                            <button
                                onClick={handleUploadGallery}
                                disabled={uploadingGallery || !galleryPreview}
                                className="mt-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition disabled:opacity-50"
                            >
                                {uploadingGallery ? 'Uploading...' : 'Upload to Gallery'}
                            </button>
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="text-sm font-bold text-gray-700 mb-3">Gallery Images</h4>
                            {gallery.length === 0 ? (
                                <p className="text-sm text-gray-400 italic">No extra images.</p>
                            ) : (
                                <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
                                    {gallery.map(img => (
                                        <div key={img.id} className="relative group">
                                            <img
                                                src={img.image}
                                                alt="Gallery"
                                                className="w-full h-20 object-cover rounded border"
                                                onError={(e) => e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23f0f0f0%22/%3E%3Ctext x=%2250%22 y=%2250%22 font-size=%2212%22 fill=%22%23999%22 text-anchor=%22middle%22 dy=%22.3em%22%3ENo img%3C/text%3E%3C/svg%3E'}
                                            />
                                            <button
                                                onClick={() => handleDeleteGallery(img.id)}
                                                className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;