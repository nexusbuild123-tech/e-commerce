import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

const TrackOrders = () => {
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('active');
    const navigate = useNavigate();

    const fetchOrders = async () => {
        const user = localStorage.getItem('user');
        if (!user) {
            setError('Please login to view your orders.');
            setLoading(false);
            return;
        }

        try {
            const userData = JSON.parse(user);
            const email = userData.email;
            if (!email) {
                setError('User email not found.');
                setLoading(false);
                return;
            }

            const res = await fetch(`${apiUrl}/my-orders/${encodeURIComponent(email)}`);
            const data = await res.json();
            if (data.status === 'success') {
                setAllOrders(data.orders);
            } else {
                setError(data.message || 'Failed to fetch orders.');
            }
        } catch (err) {
            console.error(err);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchOrders();
    }, []);

    const toggleOrderDetails = (orderId) => {
        setSelectedOrder(selectedOrder === orderId ? null : orderId);
    };

    // --- Cancel order ---
    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;

        const user = localStorage.getItem('user');
        if (!user) {
            alert('Please login to cancel.');
            return;
        }
        const userData = JSON.parse(user);
        const email = userData.email;

        try {
            const res = await fetch(`${apiUrl}/cancel-order/${orderId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'nexusBuild@123+!'
                },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (data.status === 'success') {
                alert('Order cancelled successfully.');
                fetchOrders(); // refresh list
            } else {
                alert(data.message || 'Failed to cancel order.');
            }
        } catch (error) {
            console.error('Cancel error:', error);
            alert('Something went wrong. Please try again.');
        }
    };

    // Filter orders based on active tab
    const activeOrders = allOrders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
    const historyOrders = allOrders.filter(o => o.status === 'delivered' || o.status === 'cancelled');
    const displayedOrders = activeTab === 'active' ? activeOrders : historyOrders;

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12 text-center">
                <p className="text-gray-500">Loading your orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12">
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4">{error}</div>
                {!localStorage.getItem('user') && (
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700"
                    >
                        Login
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6">My Orders</h1>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    onClick={() => setActiveTab('active')}
                    className={`px-4 py-2 font-bold text-sm ${
                        activeTab === 'active'
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Active Orders
                    {activeOrders.length > 0 && (
                        <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                            {activeOrders.length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-4 py-2 font-bold text-sm ${
                        activeTab === 'history'
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Order History
                    {historyOrders.length > 0 && (
                        <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                            {historyOrders.length}
                        </span>
                    )}
                </button>
            </div>

            {displayedOrders.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">
                        {activeTab === 'active' ? 'No active orders.' : 'No order history yet.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {displayedOrders.map((order) => {
                        const isCancellable = order.status === 'pending' || order.status === 'confirmed';
                        return (
                            <div
                                key={order.id}
                                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                            >
                                {/* Order Header */}
                                <div
                                    onClick={() => toggleOrderDetails(order.id)}
                                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="font-mono text-sm text-gray-500">#{order.id}</span>
                                        <span className="font-bold text-gray-800">{order.product_name}</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                            order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                        {isCancellable && (
                                            <span className="text-xs text-gray-400">(Cancellable)</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-blue-600">₹{order.total}</span>
                                        <svg
                                            className={`w-5 h-5 transition-transform ${selectedOrder === order.id ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {selectedOrder === order.id && (
                                    <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-3">
                                        {order.variant_name && (
                                            <p className="text-sm"><span className="font-bold">Variant:</span> {order.variant_name}</p>
                                        )}
                                        <p className="text-sm"><span className="font-bold">Quantity:</span> {order.quantity}</p>
                                        <p className="text-sm"><span className="font-bold">Total:</span> ₹{order.total}</p>
                                        <p className="text-sm"><span className="font-bold">Delivery Address:</span> {order.delivery_address}</p>
                                        <p className="text-sm"><span className="font-bold">Placed on:</span> {new Date(order.created_at).toLocaleDateString()}</p>
                                        <p className="text-sm">
                                            <span className="font-bold">Status:</span>
                                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                                order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                                                order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </p>
                                        {isCancellable && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCancelOrder(order.id);
                                                }}
                                                className="mt-2 px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition"
                                            >
                                                Cancel Order
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TrackOrders;