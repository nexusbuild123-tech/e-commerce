import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cartItems, removeFromCart, clearCart, totalItems, totalPrice } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-2xl font-bold text-gray-700">Your cart is empty</h2>
                <p className="text-gray-400 mt-2">Looks like you haven't added any items yet.</p>
                <Link
                    to="/products"
                    className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    const handleCheckout = () => {
        navigate('/checkout', {
            state: { cartItems: cartItems }
        });
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Your Cart</h1>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <ul className="divide-y divide-gray-100">
                    {cartItems.map((item) => (
                        <li key={`${item.id}-${item.variant?.color || 'default'}`} className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-gray-50 transition">
                            <img
                                src={item.image || 'https://via.placeholder.com/80'}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-xl border"
                            />
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-800">{item.name}</h3>
                                {item.variant && (
                                    <p className="text-sm text-gray-500">
                                        Color: {item.variant.color}
                                    </p>
                                )}
                                <p className="text-sm font-semibold text-blue-600">₹{item.price}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                                <button
                                    onClick={() => removeFromCart(item.id, item.variant?.color)}
                                    className="text-red-500 hover:text-red-700 font-bold text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <p className="text-sm text-gray-500">
                            Total Items: <span className="font-bold text-gray-700">{totalItems}</span>
                        </p>
                        <p className="text-xl font-black text-gray-800">
                            Total: ₹{totalPrice.toFixed(2)}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={clearCart}
                            className="px-4 py-2 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition font-bold text-sm"
                        >
                            Clear Cart
                        </button>
                        <button
                            onClick={handleCheckout}
                            disabled={cartItems.length === 0}
                            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;