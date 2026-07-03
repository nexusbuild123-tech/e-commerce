import { useState, useEffect } from 'react';

const apiUrl = import.meta.env.VITE_API_URL;

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${apiUrl}/admin/orders`, {
                headers: { 'x-api-key': 'nexusBuild@123+!' }
            });
            const data = await res.json();
            if (data.status === 'success') {
                // ✅ Only delivered and cancelled
                const history = data.orders.filter(
                    o => o.status === 'delivered' || o.status === 'cancelled'
                );
                setOrders(history);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchOrders();
    }, []);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (loading) return <p className="text-gray-500">Loading order history...</p>;

    return (
        <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-800">Order History (Delivered / Cancelled)</h2>
            {orders.length === 0 ? (
                <p className="text-gray-400 italic">No completed or cancelled orders yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-2xl shadow border border-gray-100">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">ID</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Product</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Customer</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Total</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map(order => (
                                <>
                                    <tr className="hover:bg-gray-50 transition" key={order.id}>
                                        <td className="px-4 py-3 text-sm font-mono">#{order.id}</td>
                                        <td className="px-4 py-3 text-sm font-bold">{order.product_name}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <div>{order.customer_name}</div>
                                            <div className="text-xs text-gray-400">{order.customer_phone}</div>
                                        </td>
                                        <td className="px-4 py-3 text-sm font-bold">₹{order.total}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => toggleExpand(order.id)}
                                                className="text-blue-600 hover:text-blue-800 text-xs font-bold"
                                            >
                                                {expandedId === order.id ? 'Hide' : 'Details'}
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedId === order.id && (
                                        <tr key={`${order.id}-expanded`}>
                                            <td colSpan="6" className="px-4 py-4 bg-gray-50">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <p><span className="font-bold">Order ID:</span> #{order.id}</p>
                                                        <p><span className="font-bold">Product:</span> {order.product_name}</p>
                                                        {order.variant_name && <p><span className="font-bold">Variant:</span> {order.variant_name}</p>}
                                                        <p><span className="font-bold">Quantity:</span> {order.quantity}</p>
                                                        <p><span className="font-bold">Total:</span> ₹{order.total}</p>
                                                        <p><span className="font-bold">Status:</span> {order.status}</p>
                                                        <p><span className="font-bold">Placed on:</span> {new Date(order.created_at).toLocaleString()}</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold">Customer Details</p>
                                                        <p><span className="font-bold">Name:</span> {order.customer_name}</p>
                                                        <p><span className="font-bold">Email:</span> {order.customer_email}</p>
                                                        <p><span className="font-bold">Phone:</span> {order.customer_phone}</p>
                                                        <p><span className="font-bold">Delivery Address:</span> {order.delivery_address}</p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrderHistory;