import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

const TrackOrders = () => {
    const [allOrders, setAllOrders] = useState([]);
    const [returnRequests, setReturnRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('active');
    const navigate = useNavigate();

    // --- Return Request state (modal) ---
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [returnOrderId, setReturnOrderId] = useState(null);
    const [returnReason, setReturnReason] = useState('');
    const [returnLoading, setReturnLoading] = useState(false);

    // --- Fetch orders ---
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

    // --- Fetch return requests for the user ---
    const fetchReturns = async (email) => {
        try {
            console.log('🔍 Fetching returns for email:', email);
            const res = await fetch(`${apiUrl}/my-returns/${encodeURIComponent(email)}`);
            const data = await res.json();
            console.log('📦 Return data received:', data);
            if (data.status === 'success') {
                setReturnRequests(data.requests);
            } else {
                console.warn('⚠️ Failed to fetch returns:', data.message);
            }
        } catch (err) {
            console.error('❌ Error fetching returns:', err);
        }
    };

    // --- This effect runs once on mount ---
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const userData = JSON.parse(user);
            if (userData.email) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                fetchOrders();
              
                fetchReturns(userData.email);
            }
        } else {
         
            setLoading(false);
        }
    }, []);

    // --- Optional: log when returnRequests updates ---
    useEffect(() => {
        console.log('✅ returnRequests updated:', returnRequests);
    }, [returnRequests]);

    // --- Toggle expanded details ---
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
                fetchOrders();
            } else {
                alert(data.message || 'Failed to cancel order.');
            }
        } catch (error) {
            console.error('Cancel error:', error);
            alert('Something went wrong. Please try again.');
        }
    };

    // --- Return modal handlers ---
    const openReturnModal = (orderId) => {
        setReturnOrderId(orderId);
        setReturnReason('');
        setShowReturnModal(true);
    };

    const handleReturnSubmit = async () => {
        if (!returnReason.trim()) {
            alert('Please provide a reason for return.');
            return;
        }

        const user = localStorage.getItem('user');
        if (!user) {
            alert('Please login.');
            return;
        }
        const userData = JSON.parse(user);
        const email = userData.email;

        setReturnLoading(true);
        try {
            const res = await fetch(`${apiUrl}/return-order/${returnOrderId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'nexusBuild@123+!'
                },
                body: JSON.stringify({ email, reason: returnReason })
            });
            const data = await res.json();
            if (data.status === 'success') {
                alert('Return request submitted. We will contact you shortly.');
                setShowReturnModal(false);
                // 🔁 Refresh both orders and returns – wait for them to finish
                const user = localStorage.getItem('user');
                if (user) {
                    const userData = JSON.parse(user);
                    await fetchOrders();    // wait for completion
                    await fetchReturns(userData.email); // wait for completion
                    console.log('🔄 Data refreshed after return submission.');
                }
            } else {
                alert(data.message || 'Failed to submit return request.');
            }
        } catch (error) {
            console.error('Return error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setReturnLoading(false);
        }
    };

    // --- Helper: get return status for an order ---
    const getReturnStatus = (orderId) => {
        const found = returnRequests.find(r => r.order_id === orderId);
        return found ? found.status : null;
    };

    // --- Filter orders ---
    const activeOrders = allOrders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
    const historyOrders = allOrders.filter(o => o.status === 'delivered' || o.status === 'cancelled');

    const displayedOrders = activeTab === 'active' 
        ? activeOrders 
        : activeTab === 'history' 
            ? historyOrders 
            : [];

    // --- Loading & error states ---
    if (loading) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12 text-center">
                <p className="text-gray-500 text-sm sm:text-base">Loading your orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
                <div className="bg-red-50 text-red-600 p-3 sm:p-4 rounded-xl text-sm sm:text-base mb-4">{error}</div>
                {!localStorage.getItem('user') && (
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-xl font-bold hover:bg-blue-700 text-sm sm:text-base"
                    >
                        Login
                    </button>
                )}
            </div>
        );
    }

    // --- Main render ---
    return (
        <div className="max-w-3xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-4 sm:mb-6">My Orders</h1>

            {/* Tabs */}
            <div className="flex flex-wrap border-b border-gray-200 mb-4 sm:mb-6">
                <button
                    onClick={() => setActiveTab('active')}
                    className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 font-bold text-sm ${
                        activeTab === 'active'
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Active Orders
                    {activeOrders.length > 0 && (
                        <span className="ml-1 sm:ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                            {activeOrders.length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 font-bold text-sm ${
                        activeTab === 'history'
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Order History
                    {historyOrders.length > 0 && (
                        <span className="ml-1 sm:ml-2 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                            {historyOrders.length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('returns')}
                    className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 font-bold text-sm ${
                        activeTab === 'returns'
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Returns
                    {returnRequests.length > 0 && (
                        <span className="ml-1 sm:ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                            {returnRequests.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Tab content: Active / History */}
            {activeTab !== 'returns' && (
                <>
                    {displayedOrders.length === 0 ? (
                        <div className="text-center py-8 sm:py-12">
                            <p className="text-gray-500 text-sm sm:text-base">
                                {activeTab === 'active' ? 'No active orders.' : 'No order history yet.'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3 sm:space-y-4">
                            {displayedOrders.map((order) => {
                                const isCancellable = order.status === 'pending' || order.status === 'confirmed';
                                const isReturnable = order.status === 'delivered';
                                const returnStatus = getReturnStatus(order.id);

                                return (
                                    <div
                                        key={order.id}
                                        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                                    >
                                        {/* Order Header - always visible */}
                                        <div
                                            onClick={() => toggleOrderDetails(order.id)}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 cursor-pointer hover:bg-gray-50 transition gap-2"
                                        >
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                                                <span className="font-mono text-sm text-gray-500">#{order.id}</span>
                                                <span className="font-bold text-gray-800 text-sm sm:text-base truncate max-w-[120px] sm:max-w-[200px]">
                                                    {order.product_name}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                                    order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                                                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                                {returnStatus && (
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                        returnStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        returnStatus === 'contacted' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-green-100 text-green-700'
                                                    }`}>
                                                        Return {returnStatus.charAt(0).toUpperCase() + returnStatus.slice(1)}
                                                    </span>
                                                )}
                                                {isCancellable && (
                                                    <span className="text-xs text-gray-400 hidden sm:inline">(Cancellable)</span>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                                                <span className="font-bold text-blue-600 text-sm sm:text-base">₹{order.total}</span>
                                                {isReturnable && !returnStatus && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openReturnModal(order.id);
                                                        }}
                                                        className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition"
                                                    >
                                                        Return
                                                    </button>
                                                )}
                                                {isReturnable && returnStatus && (
                                                    <span className="text-xs text-gray-500">Returned</span>
                                                )}
                                                <svg
                                                    className={`w-5 h-5 transition-transform flex-shrink-0 ${selectedOrder === order.id ? 'rotate-180' : ''}`}
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
                                            <div className="border-t border-gray-100 p-3 sm:p-4 bg-gray-50 space-y-2 sm:space-y-3">
                                                {order.variant_name && (
                                                    <p className="text-sm"><span className="font-bold">Variant:</span> {order.variant_name}</p>
                                                )}
                                                <p className="text-sm"><span className="font-bold">Quantity:</span> {order.quantity}</p>
                                                <p className="text-sm"><span className="font-bold">Total:</span> ₹{order.total}</p>
                                                <p className="text-sm break-words"><span className="font-bold">Delivery Address:</span> {order.delivery_address}</p>
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
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {isCancellable && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleCancelOrder(order.id);
                                                            }}
                                                            className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition"
                                                        >
                                                            Cancel Order
                                                        </button>
                                                    )}
                                                    {isReturnable && !returnStatus && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openReturnModal(order.id);
                                                            }}
                                                            className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition"
                                                        >
                                                            Return
                                                        </button>
                                                    )}
                                                    {isReturnable && returnStatus && (
                                                        <span className="px-4 py-2 text-sm text-gray-500">Return {returnStatus}</span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            {/* Returns Tab Content */}
            {activeTab === 'returns' && (
                <div className="space-y-3 sm:space-y-4">
                    {returnRequests.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No return requests yet.</p>
                    ) : (
                        returnRequests.map((ret) => (
                            <div key={ret.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
                                <div className="flex flex-wrap justify-between items-start gap-2">
                                    <div>
                                        <span className="font-mono text-sm text-gray-500">Return #{ret.id}</span>
                                        <span className="ml-3 font-bold text-gray-800">{ret.product_name}</span>
                                        {ret.variant_name && (
                                            <span className="text-sm text-gray-500 ml-2">({ret.variant_name})</span>
                                        )}
                                        <div className="text-xs text-gray-400 mt-1">Order #{ret.order_id}</div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        ret.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                        ret.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                                        'bg-green-100 text-green-700'
                                    }`}>
                                        {ret.status.charAt(0).toUpperCase() + ret.status.slice(1)}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">Reason: {ret.reason || 'Not provided'}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Requested on: {new Date(ret.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Return Modal */}
            {showReturnModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Return Request</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Please provide a reason for returning this order. We will contact you shortly.
                        </p>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Reason *</label>
                            <textarea
                                rows="3"
                                value={returnReason}
                                onChange={(e) => setReturnReason(e.target.value)}
                                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g., Wrong item received, Damaged product, etc."
                            />
                        </div>
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={handleReturnSubmit}
                                disabled={returnLoading}
                                className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {returnLoading ? 'Submitting...' : 'Submit Return Request'}
                            </button>
                            <button
                                onClick={() => setShowReturnModal(false)}
                                className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrackOrders;