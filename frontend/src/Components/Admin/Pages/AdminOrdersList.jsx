import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id || order.id}>
                                <td className="order-id-cell">{(order._id || order.id).slice(-8)}</td>
                                <td>{new Date(order.createdAt || order.date || Date.now()).toLocaleDateString()}</td>
                                <td>
                                    {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                                </td>
                                <td>{order.items ? order.items.length : 0} items</td>
                                <td>${order.totalAmount || order.amount}</td>
                                <td>
                                    <span className={`status-badge status-${(order.orderStatus || order.status || 'pending').toLowerCase()}`}>
                                        {order.orderStatus || order.status || 'Pending'}
                                    </span>
                                </td>
                                <td>
                                    <Link to={`/admin/orders/${order._id || order.id}`} className="btn-view">
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center' }}>No orders found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrdersList;
