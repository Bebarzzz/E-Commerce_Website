import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/Checkout.css';
import { ShopContext } from '../Context/ShopContext';
import { createOrder, formatCartForOrder } from '../services/orderService';

const Checkout = () => {
  const { getTotalCartAmount, all_product, cartItems, clearCart } = useContext(ShopContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  });

  useEffect(() => {
    if (!localStorage.getItem('auth-token')) {
      navigate('/login', { state: { from: '/checkout' }, replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      // Basic validation
      const requiredFields = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'zipCode', 'country', 'phone'];
      for (const field of requiredFields) {
        if (!formData[field]) {
          throw new Error('Please fill in all fields');
        }
      }

      const orderItems = formatCartForOrder(cartItems, all_product);
      if (orderItems.length === 0) {
        throw new Error('Your cart is empty');
      }

      const orderData = {
        items: orderItems,
        totalAmount: getTotalCartAmount(),
        shippingAddress: formData
      };

      await createOrder(orderData);

      clearCart();
      alert('Order placed successfully!');
      navigate('/');

    } catch (err) {
      setError(err.message || 'Failed to place order');
      console.error('Order error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='checkout'>
      <div className="checkout-container">
        <div className="checkout-left">
          <h2>Shipping Information</h2>
          <div className="checkout-fields">
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            <div className="checkout-fields-row">
              <input name="firstName" value={formData.firstName} onChange={handleChange} type="text" placeholder='First Name' />
              <input name="lastName" value={formData.lastName} onChange={handleChange} type="text" placeholder='Last Name' />
            </div>
            <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder='Email Address' />
            <input name="street" value={formData.street} onChange={handleChange} type="text" placeholder='Street Address' />
            <div className="checkout-fields-row">
              <input name="city" value={formData.city} onChange={handleChange} type="text" placeholder='City' />
              <input name="state" value={formData.state} onChange={handleChange} type="text" placeholder='State' />
            </div>
            <div className="checkout-fields-row">
              <input name="zipCode" value={formData.zipCode} onChange={handleChange} type="text" placeholder='Zip Code' />
              <input name="country" value={formData.country} onChange={handleChange} type="text" placeholder='Country' />
            </div>
            <input name="phone" value={formData.phone} onChange={handleChange} type="text" placeholder='Phone Number' />
          </div>
        </div>
        <div className="checkout-right">
          <div className="checkout-summary">
            <h2>Order Summary</h2>
            <div className="checkout-total-item">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <div className="checkout-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <div className="checkout-total-item">
              <h3>Total</h3>
              <h3>${getTotalCartAmount()}</h3>
            </div>
            <button className='checkout-btn' onClick={handlePlaceOrder} disabled={loading}>
              {loading ? 'PROCESSING...' : 'PLACE ORDER'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
