import React, { useState } from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom';

import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
export const Navbar = () => {

  const [menu,setMenu] = useState("Inventory");

  return (
    <div className='navbar'>
      <div className ='nav-logo'>
        <img src={logo} alt='' />
        <p>Automotive</p>
      </div>
      <ul className="nav-menu">
        <li onClick={() => setMenu("Inventory")}><Link style={{ textDecoration: 'none' }} to='/'>Inventory</Link>{menu === "Inventory" && <hr />}</li>
        <li onClick={() => setMenu("New cars")}><Link style={{ textDecoration: 'none' }} to='/new-cars'>New cars</Link>{menu === "New cars" && <hr />}</li>
        <li onClick={() => setMenu("Used cars")}><Link style={{ textDecoration: 'none' }} to='/used-cars'>Used cars</Link>{menu === "Used cars" && <hr />}</li>
        <li onClick={() => setMenu("Offers")}><Link style={{ textDecoration: 'none' }} to='/offers'>Offers</Link>{menu === "Offers" && <hr />}</li>
      </ul>
      <div className="nav-login-cart">
        <Link to='/login'><button>Login</button></Link>
        <div className="nav-cart-container">
          <Link to='/cart'><img src={cart_icon} alt="" /></Link>
          <div className="nav-cart-count">0</div>
        </div>
      </div>
    </div>
  )
}

export default Navbar