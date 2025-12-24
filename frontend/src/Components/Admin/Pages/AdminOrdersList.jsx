import React, { useEffect, useState } from 'react';
import { getAllOrders } from '../../../services/orderService';

const AdminOrdersList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await getAllOrders();
            setOrders(data);
        } catch (err) {
            setError('Failed to fetch orders');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading orders...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="admin-orders-list">
            <div className="admin-page-header">
                <h1>Orders</h1>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Total Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id || order.id}>
                                <td>{order._id || order.id}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>{order.items ? order.items.length : 0} items</td>
                                <td>${order.totalAmount}</td>
                                <td>
                                    <span className={`status-badge ${order.orderStatus?.toLowerCase() || 'pending'}`}>
                                        {order.orderStatus || 'Pending'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center' }}>No orders found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrdersList;
