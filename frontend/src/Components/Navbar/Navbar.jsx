import React, { useContext, useState, useRef } from 'react'
import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import { isAuthenticated, logoutUser } from '../../services/userService';

import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import nav_dropdown from '../Assets/nav_dropdown.png'

export const Navbar = () => {

  const [menu, setMenu] = useState("Home");
  const { getTotalCartItems } = useContext(ShopContext);
  const navigate = useNavigate();
  const menuRef = useRef();

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle('nav-menu-visible');
    e.target.classList.toggle('open');
  }

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div className='navbar'>
      <div className='nav-logo'>
        <Link to='/' style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => setMenu("Home")}>
          <img src={logo} alt='' />
          <p>RevNRun</p>
        </Link>
      </div>
      <ul ref={menuRef} className="nav-menu">
        <li onClick={() => setMenu("Home")}><Link style={{ textDecoration: 'none' }} to='/'>Home</Link>{menu === "Home" && <hr />}</li>
        <li onClick={() => setMenu("New cars")}><Link style={{ textDecoration: 'none' }} to='/new-cars'>New cars</Link>{menu === "New cars" && <hr />}</li>
        <li onClick={() => setMenu("Used cars")}><Link style={{ textDecoration: 'none' }} to='/used-cars'>Used cars</Link>{menu === "Used cars" && <hr />}</li>
        <li onClick={() => setMenu("Offers")}><Link style={{ textDecoration: 'none' }} to='/offers'>Offers</Link>{menu === "Offers" && <hr />}</li>
        <li onClick={() => setMenu("Contact Us")}><Link style={{ textDecoration: 'none' }} to='/contact'>Contact Us</Link>{menu === "Contact Us" && <hr />}</li>
      </ul>
      <div className="nav-login-cart">
        {isAuthenticated() ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to='/login'><button>Login</button></Link>
        )}
        <div className="nav-cart-container">
          <Link to='/cart'><img src={cart_icon} alt="" /></Link>
          <div className="nav-cart-count">{getTotalCartItems()}</div>
        </div>
      </div>
      <img className='nav-dropdown' onClick={dropdown_toggle} src={nav_dropdown} alt="" />
    </div>
  )
}

export default Navbar