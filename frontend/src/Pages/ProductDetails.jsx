import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;
const PLACEHOLDER_IMAGE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='200' y='150' font-family='Arial' font-size='20' fill='%23999' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E`;

const ProductDetail = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [productType, setProductType] = useState(null);
    const [variants, setVariants] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedThumbnail, setSelectedThumbnail] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Product type
                const typeRes = await fetch(`${apiUrl}/product-types`);
                const typeData = await typeRes.json();
                let foundType = null;
                if (typeData.status === 'success') {
                    foundType = typeData.productTypes.find(pt => pt.id == id);
                    setProductType(foundType);
                }

                // 2. Color variants – force boolean
                const variantRes = await fetch(`${apiUrl}/product-color-variants/${id}`);
                const variantData = await variantRes.json();
                console.log('🔍 Variants API response:', variantData);

                let variantList = [];
                if (variantData.status === 'success' && variantData.variants.length > 0) {
                    variantList = variantData.variants.map(v => ({
                        ...v,
                        is_available: v.is_available === 1 || v.is_available === true
                    }));
                } else {
                    variantList = [{
                        id: 0,
                        color_name: 'Default',
                        color_hex: '#1f2937',
                        image: null,
                        is_available: true
                    }];
                }
                setVariants(variantList);

                // Select the first available color; if none, select the first one
                const firstAvailable = variantList.find(v => v.is_available) || variantList[0];
                setSelectedColor(firstAvailable);
                console.log('✅ Selected color:', firstAvailable);

                // 3. Gallery
                const galleryRes = await fetch(`${apiUrl}/product-type-gallery/${id}`);
                const galleryData = await galleryRes.json();
                if (galleryData.status === 'success') {
                    setGallery(galleryData.images);
                }
            } catch (error) {
                console.error('Error fetching product details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // ---- Thumbnails ----
    const thumbnails = useMemo(() => {
        const images = [];
        if (selectedColor?.image) images.push(selectedColor.image);
        if (productType?.image && !images.includes(productType.image)) images.push(productType.image);
        gallery.forEach(g => {
            if (!images.includes(g.image)) images.push(g.image);
        });
        return images;
    }, [selectedColor, productType, gallery]);

    // ---- Active image ----
    const activeImage = useMemo(() => {
        if (selectedThumbnail) return selectedThumbnail;
        if (selectedColor?.image) return selectedColor.image;
        return thumbnails.length > 0 ? thumbnails[0] : PLACEHOLDER_IMAGE;
    }, [selectedThumbnail, selectedColor, thumbnails]);

    // ---- Handlers ----
    const handleColorSelect = (color) => {
        setSelectedColor(color);
        setSelectedThumbnail(null);
    };

    const handleThumbnailClick = (img) => {
        setSelectedThumbnail(img);
    };

    // ---- Availability check ----
    const isSelectedColorAvailable = selectedColor ? selectedColor.is_available === true : false;
    console.log('🟢 Selected color availability:', isSelectedColorAvailable);

    if (loading) {
        return (
            <div className="bg-white min-h-screen py-12 flex items-center justify-center">
                <div className="text-gray-500">Loading product details...</div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Left: Image Viewer */}
                    <div className="w-full md:w-1/2 flex flex-col">
                        <div className="bg-gray-50 rounded-3xl overflow-hidden p-8 flex items-center justify-center border border-gray-100 shadow-inner">
                            <img
                                src={activeImage}
                                alt="Product"
                                className="w-full h-auto object-contain max-h-[500px] transition-all duration-500"
                                onError={(e) => e.target.src = PLACEHOLDER_IMAGE}
                            />
                        </div>
                        {thumbnails.length > 0 && (
                            <div className="flex gap-4 mt-6 overflow-x-auto pb-2">
                                {thumbnails.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleThumbnailClick(img)}
                                        className={`w-20 h-20 rounded-xl border-2 overflow-hidden flex-shrink-0 ${
                                            activeImage === img ? 'border-blue-600' : 'border-transparent'
                                        }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`Thumb ${idx}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => e.target.src = PLACEHOLDER_IMAGE}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Details */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Premium Variant</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-500 text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">ID: {id}</span>
                        </div>

                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                            {productType?.name || 'Product'}
                        </h1>

                        <p className="text-gray-500 text-lg mb-6 leading-relaxed">
                            {productType?.description || 'No description available.'}
                        </p>

                        <div className="text-3xl font-black text-gray-900 mb-6">
                            ₹{productType?.price || '0.00'}
                            {productType?.discount > 0 && (
                                <>
                                    <span className="text-lg text-gray-400 line-through ml-3 font-medium">
                                        ₹{(productType.price / (1 - productType.discount/100)).toFixed(2)}
                                    </span>
                                    <span className="text-sm bg-red-100 text-red-700 px-2 py-0.5 rounded-full ml-2">
                                        {productType.discount}% off
                                    </span>
                                </>
                            )}
                        </div>

                        {/* COLOR PALETTE – all colors clickable */}
                        {variants.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                                    Color: <span className="text-gray-500 font-medium normal-case">{selectedColor?.color_name || 'N/A'}</span>
                                </h3>
                                <div className="flex flex-wrap gap-4">
                                    {variants.map((color) => {
                                        const isAvailable = color.is_available === true;
                                        return (
                                            <button
                                                key={color.id}
                                                onClick={() => handleColorSelect(color)}
                                                className={`w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                                                    selectedColor?.id === color.id
                                                        ? 'border-blue-600 scale-110 shadow-lg'
                                                        : 'border-transparent hover:scale-105'
                                                } ${!isAvailable ? 'opacity-50' : ''}`}
                                                style={{
                                                    backgroundColor: color.color_hex,
                                                    outline: selectedColor?.id === color.id ? '2px solid white' : 'none',
                                                    outlineOffset: '-4px'
                                                }}
                                                aria-label={`Select ${color.color_name}`}
                                                title={color.color_name + (isAvailable ? '' : ' (Out of Stock)')}
                                            >
                                                {!isAvailable && (
                                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] rounded-full px-1">✕</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Specifications */}
                        {productType?.specifications && (
                            <div className="mb-6 border-t border-gray-100 pt-4">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">Specifications</h3>
                                <div className="text-sm text-gray-600 whitespace-pre-line">
                                    {productType.specifications}
                                </div>
                            </div>
                        )}

                        {/* ACTION BUTTONS – disabled if selected color is out of stock */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-4">
                            <button
                                onClick={() => alert('Add to Cart')}
                                disabled={!isSelectedColorAvailable}
                                className={`flex-1 text-lg font-bold py-4 px-8 rounded-xl transition-all transform hover:-translate-y-1 ${
                                    isSelectedColorAvailable
                                        ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-xl shadow-gray-900/20'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none hover:translate-y-0'
                                }`}
                            >
                                {isSelectedColorAvailable ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                            <button
                                onClick={() => alert('Buy Now')}
                                disabled={!isSelectedColorAvailable}
                                className={`flex-1 text-lg font-bold py-4 px-8 rounded-xl transition-all transform hover:-translate-y-1 ${
                                    isSelectedColorAvailable
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-600/20'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none hover:translate-y-0'
                                }`}
                            >
                                {isSelectedColorAvailable ? 'Buy Now' : 'Unavailable'}
                            </button>
                        </div>

                        <div className="mt-10 grid grid-cols-2 gap-4 border-t border-gray-100 pt-8">
                            <div className="flex items-center gap-3 text-gray-600 text-sm font-medium">
                                <span className="text-xl">🚚</span> Free Fast Delivery
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 text-sm font-medium">
                                <span className="text-xl">🛡️</span> 1 Year Warranty
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;