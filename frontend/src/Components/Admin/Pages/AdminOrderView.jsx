import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, updateOrderStatus } from '../../../services/orderService';
import './AdminOrderView.css';

const AdminOrderView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    useEffect(() => {
        fetchOrder();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const data = await getOrderById(id);
            setOrder(data);
        } catch (err) {
            setError('Failed to fetch order details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        
        try {
            setUpdating(true);
            setStatusMessage('');
            await updateOrderStatus(id, newStatus);
            setOrder(prev => ({ ...prev, orderStatus: newStatus }));
            setStatusMessage('Status updated successfully!');
            setTimeout(() => setStatusMessage(''), 3000);
        } catch (err) {
            setStatusMessage('Failed to update status');
            console.error(err);
        } finally {
            setUpdating(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    if (loading) return <div className="loading-state">Loading order details...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!order) return <div className="error-message">Order not found</div>;

    return (
        <div className="admin-order-view">
            <div className="admin-page-header">
                <div className="header-left">
                    <button className="btn-back" onClick={() => navigate('/admin/orders')}>
                        ← Back to Orders
                    </button>
                    <h1>Order Details</h1>
                </div>
            </div>

            {statusMessage && (
                <div className={`status-message ${statusMessage.includes('success') ? 'success' : 'error'}`}>
                    {statusMessage}
                </div>
            )}

            <div className="order-view-container">
                {/* Order Header */}
                <div className="order-header-card">
                    <div className="order-id-section">
                        <span className="label">Order ID</span>
                        <span className="order-id">{order._id}</span>
                    </div>
                    <div className="order-date-section">
                        <span className="label">Order Date</span>
                        <span className="value">{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="order-status-section">
                        <span className="label">Status</span>
                        <div className="status-dropdown-container">
                            <select 
                                value={order.orderStatus || 'pending'} 
                                onChange={handleStatusChange}
                                disabled={updating}
                                className={`status-dropdown status-${order.orderStatus || 'pending'}`}
                            >
                                {ORDER_STATUSES.map(status => (
                                    <option key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </option>
                                ))}
                            </select>
                            {updating && <span className="updating-spinner">⟳</span>}
                        </div>
                    </div>
                </div>

                <div className="order-details-grid">
                    {/* Customer Information */}
                    <div className="order-card customer-info">
                        <h3>Customer Information</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="label">Name</span>
                                <span className="value">
                                    {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                                </span>
                            </div>
                            <div className="info-item">
                                <span className="label">Email</span>
                                <span className="value">{order.shippingAddress?.email}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Phone</span>
                                <span className="value">{order.shippingAddress?.phone}</span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="order-card shipping-address">
                        <h3>Shipping Address</h3>
                        <div className="address-content">
                            <p>{order.shippingAddress?.street}</p>
                            <p>
                                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                            </p>
                            <p>{order.shippingAddress?.country}</p>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="order-card order-items">
                    <h3>Order Items</h3>
                    <div className="items-table-container">
                        <table className="items-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items?.map((item, index) => (
                                    <tr key={item._id || index}>
                                        <td>
                                            <img 
                                                src={item.image} 
                                                alt={item.name} 
                                                className="item-image"
                                                onError={(e) => {
                                                    e.target.src = '/placeholder-car.png';
                                                }}
                                            />
                                        </td>
                                        <td className="item-name">{item.name}</td>
                                        <td>{formatCurrency(item.price)}</td>
                                        <td>{item.quantity}</td>
                                        <td className="item-total">{formatCurrency(item.price * item.quantity)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="order-card order-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-content">
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>{formatCurrency(order.totalAmount)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>{formatCurrency(order.totalAmount)}</span>
                        </div>
                    </div>
                </div>

                {/* Receipt URL if available */}
                {order.receiptURL && (
                    <div className="order-card receipt-section">
                        <h3>Receipt</h3>
                        <a href={order.receiptURL} target="_blank" rel="noopener noreferrer" className="btn-primary">
                            View Receipt
                        </a>
                    </div>
                )}

                {/* Timestamps */}
                <div className="order-timestamps">
                    <span>Created: {formatDate(order.createdAt)}</span>
                    {order.updatedAt && order.updatedAt !== order.createdAt && (
                        <span>Last Updated: {formatDate(order.updatedAt)}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOrderView;
