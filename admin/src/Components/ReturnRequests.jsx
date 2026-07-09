import { useState, useEffect } from 'react';

const apiUrl = import.meta.env.VITE_API_URL;

const ReturnRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const res = await fetch(`${apiUrl}/admin/return-requests`, {
                headers: { 'x-api-key': 'nexusBuild@123+!' }
            });
            const data = await res.json();
            if (data.status === 'success') {
                setRequests(data.requests);
            }
        } catch (error) {
            console.error('Error fetching return requests:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchRequests();
    }, []);

    const updateStatus = async (id, newStatus) => {
        if (!window.confirm(`Change return request #${id} status to ${newStatus}?`)) return;
        try {
            const res = await fetch(`${apiUrl}/admin/return-requests/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'nexusBuild@123+!'
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                alert('Status updated!');
                fetchRequests();
            }
        } catch (error) {
            console.error('Update error:', error);
        }
    };

    if (loading) return <p className="text-gray-500">Loading return requests...</p>;

    return (
        <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-800">Return Requests</h2>
            {requests.length === 0 ? (
                <p className="text-gray-400 italic">No return requests yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-2xl shadow border border-gray-100">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">ID</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Order ID</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Customer</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Product</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Reason</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {requests.map(req => (
                                <tr key={req.id}>
                                    <td className="px-4 py-3 text-sm font-mono">#{req.id}</td>
                                    <td className="px-4 py-3 text-sm font-mono">#{req.order_id}</td>
                                    <td className="px-4 py-3 text-sm">
                                        <div>{req.customer_name}</div>
                                        <div className="text-xs text-gray-400">{req.customer_phone}</div>
                                        <div className="text-xs text-gray-400">{req.customer_email}</div>
                                    </td>
                                    <td className="px-4 py-3 text-sm font-bold">{req.product_name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{req.reason || '-'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            req.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={req.status}
                                            onChange={(e) => updateStatus(req.id, e.target.value)}
                                            className="text-xs border rounded px-2 py-1"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="contacted">Contacted</option>
                                            <option value="resolved">Resolved</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ReturnRequests;