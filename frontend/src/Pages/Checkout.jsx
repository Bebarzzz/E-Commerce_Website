import React, { useContext } from 'react';
import './CSS/Checkout.css';
import { ShopContext } from '../Context/ShopContext';

const Checkout = () => {
  const { getTotalCartAmount } = useContext(ShopContext);

  return (
    <div className='checkout'>
      <div className="checkout-container">
        <div className="checkout-left">
          <h2>Shipping Information</h2>
          <div className="checkout-fields">
            <div className="checkout-fields-row">
              <input type="text" placeholder='First Name' />
              <input type="text" placeholder='Last Name' />
            </div>
            <input type="email" placeholder='Email Address' />
            <input type="text" placeholder='Street Address' />
            <div className="checkout-fields-row">
              <input type="text" placeholder='City' />
              <input type="text" placeholder='State' />
            </div>
            <div className="checkout-fields-row">
              <input type="text" placeholder='Zip Code' />
              <input type="text" placeholder='Country' />
            </div>
            <input type="text" placeholder='Phone Number' />
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
            <button className='checkout-btn'>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
