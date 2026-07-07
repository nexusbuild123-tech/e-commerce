import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Toast from '../components/Toast';
import LocationPicker from '../components/LocationPicker';

const apiUrl = import.meta.env.VITE_API_URL;

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const state = location.state || {};

    const items = useMemo(() => {
        return state.cartItems || (state.product ? [state.product] : []);
    }, [state.cartItems, state.product]);

    const isFromCart = !!state.cartItems;

    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const [formData, setFormData] = useState(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            return {
                customer_name: user.name || '',
                customer_email: user.email || '',
                customer_phone: user.mobile || '',
                city: '',
                state: '',
                pincode: '',
                delivery_address: '' 
            };
        }
        return {
            customer_name: '',
            customer_email: '',
            customer_phone: '',
            city: '',
            state: '',
            pincode: '',
            delivery_address: ''
        };
    });

    useEffect(() => {
        if (items.length === 0) {
            navigate('/');
        }
    }, [items, navigate]);

    if (items.length === 0) {
        return null;
    }

    const totalAmount = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // FIX: Map se aayi hui full detailed address ko handle aur set karne ke liye
    const handleLocationSelected = (data) => {
        setFormData(prev => ({
            ...prev,
            city: data.city || prev.city,
            state: data.state || prev.state,
            pincode: data.pincode || prev.pincode,
            // Full verified address textarea me load karwa diya
            delivery_address: data.fullAddress || prev.delivery_address 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.customer_name || !formData.customer_email || !formData.customer_phone || !formData.delivery_address || !formData.city || !formData.pincode) {
            setToast({ message: 'Please fill all fields (Name, Email, Phone, Address, City, Pincode).', type: 'error' });
            return;
        }

        // Final structured address dispatch karne ke liye
        const finalAddress = formData.delivery_address.includes(formData.city) 
            ? formData.delivery_address 
            : `${formData.delivery_address}, ${formData.city}, ${formData.state}, ${formData.pincode}`;

        setLoading(true);
        try {
            for (const item of items) {
                const payload = {
                    product_type_id: item.id,
                    variant_id: item.variant?.id || null,
                    product_name: item.name,
                    variant_name: item.variant?.color || null,
                    price: item.price,
                    quantity: item.quantity || 1,
                    total: item.price * (item.quantity || 1),
                    customer_name: formData.customer_name,
                    customer_email: formData.customer_email,
                    customer_phone: formData.customer_phone,
                    delivery_address: finalAddress
                };

                const res = await fetch(`${apiUrl}/place-order`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': 'nexusBuild@123+!'
                    },
                    body: JSON.stringify(payload)
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message || 'Order failed');
                }
            }

            if (isFromCart) {
                clearCart();
            }

            setToast({ message: '🎉 All orders placed successfully! We will contact you shortly.', type: 'success' });
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (error) {
            console.error('Order error:', error);
            setToast({ message: error.message || 'Something went wrong. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
                    {isFromCart ? 'Checkout – Multiple Items' : 'Checkout – Cash on Delivery'}
                </h1>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Order Summary */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-700 mb-4">Order Summary</h2>
                        {items.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-4 border-b pb-3 mb-3">
                                <img
                                    src={item.image || 'https://via.placeholder.com/80'}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded-xl"
                                />
                                <div>
                                    <h3 className="font-bold text-gray-800">{item.name}</h3>
                                    {item.variant && <p className="text-sm text-gray-500">Color: {item.variant.color}</p>}
                                    <p className="text-sm font-semibold text-blue-600">₹{item.price}</p>
                                    <p className="text-xs text-gray-400">Qty: {item.quantity || 1}</p>
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-between mt-4 text-lg font-bold">
                            <span>Total:</span>
                            <span>₹{totalAmount.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-green-600 mt-2">✅ Cash on Delivery available</p>
                    </div>

                    {/* Delivery Form */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-700 mb-4">Delivery Details</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-600">Full Name *</label>
                                <input
                                    type="text"
                                    name="customer_name"
                                    value={formData.customer_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600">Email *</label>
                                <input
                                    type="email"
                                    name="customer_email"
                                    value={formData.customer_email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600">Phone *</label>
                                <input
                                    type="tel"
                                    name="customer_phone"
                                    value={formData.customer_phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {/* Map Picker Component */}
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Select Delivery Location on Map</label>
                                <LocationPicker onLocationSelected={handleLocationSelected} />
                            </div>

                            {/* Auto-filled details */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-bold text-gray-600">City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600">Pincode *</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600">State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-600">Address (House / Street / Landmark) *</label>
                                <textarea
                                    name="delivery_address"
                                    rows="3"
                                    value={formData.delivery_address}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                                    placeholder="Select location above or type complete address manually"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {loading ? 'Placing Orders...' : 'Confirm Order (Cash on Delivery)'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Checkout;