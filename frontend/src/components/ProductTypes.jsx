import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const apiUrl = import.meta.env.VITE_API_URL;

// Inline SVG placeholder (no external network request)
const PLACEHOLDER_IMAGE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='200' y='150' font-family='Arial' font-size='20' fill='%23999' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E`;

const ProductTypes = () => {
  const { productId } = useParams();
  const [loading, setLoading] = useState(true);
  const [types, setTypes] = useState([]);
  const [parentName, setParentName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${apiUrl}/product-types`);
        const data = await res.json();
        console.log('🔍 API Response:', data); // <-- Debug log

        if (data.status === 'success') {
          const filtered = data.productTypes.filter(
            t => t.category_id == productId || t.product_card_id == productId
          );
          setTypes(filtered);

          if (filtered.length > 0) {
            const first = filtered[0];
            if (first.category_name) {
              setParentName(first.category_name);
            } else if (first.product_card_name) {
              setParentName(first.product_card_name);
            } else {
              setParentName('Products');
            }
          } else {
            let name = 'Products';
            try {
              const [catRes, cardRes] = await Promise.all([
                fetch(`${apiUrl}/categories`),
                fetch(`${apiUrl}/product-cards`)
              ]);
              const cats = await catRes.json();
              const cards = await cardRes.json();

              let found = false;
              if (cats.status === 'success') {
                const foundCat = cats.categories.find(c => c.id == productId);
                if (foundCat) {
                  name = foundCat.name;
                  found = true;
                }
              }
              if (!found && cards.status === 'success') {
                const foundCard = cards.products.find(c => c.id == productId);
                if (foundCard) {
                  name = foundCard.name;
                }
              }
            } catch (e) {
              console.error('Error fetching parent name:', e);
            }
            setParentName(name);
          }
        }
      } catch (error) {
        console.error('Error fetching product types:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-12 flex items-center justify-center">
        <div className="text-gray-500">Loading product types...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center md:text-left">
          <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">Categories & Variants</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-1">
            Explore Types of {parentName || 'Products'}
          </h1>
          <p className="text-gray-500 mt-2">Select the perfect type or model variant that suits your requirement.</p>
        </div>

        {types.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No product types available for this selection.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {types.map((type) => {
              // 🟢 SAFE DATA PARSING
              const price = parseFloat(type.price);
              const discount = parseFloat(type.discount);
              const rating = parseFloat(type.rating);

              const hasPrice = !isNaN(price) && price !== null;
              const hasDiscount = !isNaN(discount) && discount > 0;
              const hasRating = !isNaN(rating) && rating > 0;

              let originalPrice = null;
              if (hasPrice && hasDiscount) {
                originalPrice = price / (1 - discount / 100);
              }

              // 🟢 DEBUG LOG per item
              console.log(`📦 ${type.name}: price=${type.price}, discount=${type.discount}, rating=${type.rating}`);

              return (
                <div key={type.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                  <div className="h-56 bg-gray-50 p-6 flex items-center justify-center overflow-hidden relative">
                    <img
                      src={type.image || PLACEHOLDER_IMAGE}
                      alt={type.name}
                      className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                      {type.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-2 flex-grow">{type.description || 'No description available.'}</p>

                    {/* 🟢 PRICE & DISPLAY SECTION */}
                    <div className="flex flex-wrap items-center gap-2 mb-3 min-h-[2rem]">
                      {hasPrice ? (
                        <>
                          <span className="text-lg font-bold text-blue-600">
                            {price === 0 ? 'Free' : `₹${price.toFixed(2)}`}
                          </span>
                          {hasDiscount && originalPrice && (
                            <>
                              <span className="text-sm text-red-500 line-through ml-1">
                                ₹{originalPrice.toFixed(2)}
                              </span>
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                                {discount}% off
                              </span>
                            </>
                          )}
                        </>
                      ) : (
                        <span className="text-sm text-gray-400 font-medium">⚠️ Price not set</span>
                      )}
                      {hasRating && (
                        <span className="text-sm text-yellow-500 ml-auto">⭐ {rating.toFixed(1)}</span>
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-100 mt-auto">
                      <Link
                        to={`/product-detail/${type.id}`}
                        className="w-full bg-gray-950 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300"
                      >
                        <span>View Specifications</span>
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTypes;