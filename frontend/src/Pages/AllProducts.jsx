import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;
const PLACEHOLDER_IMAGE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='200' y='150' font-family='Arial' font-size='20' fill='%23999' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E`;

const AllProducts = () => {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const res = await fetch(`${apiUrl}/product-types`);
                const data = await res.json();
                if (data.status === 'success') {
                    setProducts(data.productTypes);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllProducts();
    }, []);

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen py-12 flex items-center justify-center">
                <div className="text-gray-500">Loading products...</div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="bg-gray-50 min-h-screen py-12 flex items-center justify-center">
                <div className="text-gray-500">No products found.</div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                        All Products
                    </h1>
                    <p className="text-gray-500 mt-2">Browse all available product types.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col"
                        >
                            <div className="h-48 bg-gray-50 p-4 flex items-center justify-center">
                                <img
                                    src={product.image || PLACEHOLDER_IMAGE}
                                    alt={product.name}
                                    className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => e.target.src = PLACEHOLDER_IMAGE}
                                />
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                                    {product.name}
                                </h3>
                                {product.description && (
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                                        {product.description}
                                    </p>
                                )}
                                {product.price && (
                                    <p className="text-lg font-bold text-blue-600">
                                        ₹{product.price}
                                        {product.discount > 0 && (
                                            <span className="text-sm text-red-500 line-through ml-2">
                                                ₹{((product.price / (1 - product.discount/100))).toFixed(2)}
                                            </span>
                                        )}
                                    </p>
                                )}
                                <Link
                                    to={`/product-detail/${product.id}`}
                                    className="mt-3 w-full text-center bg-gray-900 text-white font-bold py-2 px-4 rounded-xl hover:bg-blue-600 transition-colors"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllProducts;