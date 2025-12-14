import React, { useContext, useState } from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';

import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
export const Navbar = () => {

  const [menu, setMenu] = useState("Home");
  const { getTotalCartItems } = useContext(ShopContext);

  return (
    <div className='navbar'>
      <div className='nav-logo'>
        <Link to='/' style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => setMenu("Home")}>
          <img src={logo} alt='' />
          <p>Automotive</p>
        </Link>
      </div>
      <ul className="nav-menu">
        <li onClick={() => setMenu("Home")}><Link style={{ textDecoration: 'none' }} to='/'>Home</Link>{menu === "Home" && <hr />}</li>
        <li onClick={() => setMenu("New cars")}><Link style={{ textDecoration: 'none' }} to='/new-cars'>New cars</Link>{menu === "New cars" && <hr />}</li>
        <li onClick={() => setMenu("Used cars")}><Link style={{ textDecoration: 'none' }} to='/used-cars'>Used cars</Link>{menu === "Used cars" && <hr />}</li>
        <li onClick={() => setMenu("Offers")}><Link style={{ textDecoration: 'none' }} to='/offers'>Offers</Link>{menu === "Offers" && <hr />}</li>
        <li onClick={() => setMenu("Contact Us")}><Link style={{ textDecoration: 'none' }} to='/contact'>Contact Us</Link>{menu === "Contact Us" && <hr />}</li>
      </ul>
      <div className="nav-login-cart">
        <Link to='/login'><button>Login</button></Link>
        <div className="nav-cart-container">
          <Link to='/cart'><img src={cart_icon} alt="" /></Link>
          <div className="nav-cart-count">{getTotalCartItems()}</div>
        </div>
      </div>
    </div>
  )
}

export default Navbar