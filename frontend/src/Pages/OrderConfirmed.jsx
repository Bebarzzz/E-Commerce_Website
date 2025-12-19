import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import './CSS/OrderConfirmed.css';

const OrderConfirmed = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        if (location.state && location.state.order) {
            setOrderDetails(location.state.order);
        } else {
            // Redirect to home if accessed directly without state
            navigate('/');
        }
    }, [location, navigate]);

    if (!orderDetails) {
        return null;
    }

    return (
        <div className='order-confirmed'>
            <div className="order-confirmed-container">
                <div className="success-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h1>Thank You!</h1>
                <p className="order-message">Your order has been placed successfully.</p>

                <div className="order-details">
                    <h2>Order Summary</h2>
                    <div className="order-info">
                        <p><strong>Shipping to:</strong></p>
                        <p>{orderDetails.shippingAddress.firstName} {orderDetails.shippingAddress.lastName}</p>
                        <p>{orderDetails.shippingAddress.street}</p>
                        <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zipCode}</p>
                        <p>{orderDetails.shippingAddress.country}</p>
                    </div>

                    <div className="order-items">
                        <h3>Items</h3>
                        {orderDetails.items.map((item, index) => (
                            <div key={index} className="order-item">
                                <span className="item-name">{item.quantity}x {item.name}</span>
                                <span className="item-price">${item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>

                    <div className="order-total">
                        <h3>Total Amount</h3>
                        <h3>${orderDetails.totalAmount}</h3>
                    </div>
                </div>

                <div className="order-actions">
                    <Link to="/">
                        <button className="continue-shopping-btn">Continue Shopping</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmed;
