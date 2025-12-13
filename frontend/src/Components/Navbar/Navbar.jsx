import React, { useContext, useState, useEffect } from 'react'
import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';

import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
export const Navbar = () => {

  const [menu,setMenu] = useState("Inventory");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const { getTotalCartItems } = useContext(ShopContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('user-role');
    setIsLoggedIn(!!token);
    setUserRole(role || '');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user-email');
    localStorage.removeItem('user-role');
    setIsLoggedIn(false);
    setUserRole('');
    navigate('/login');
  };

  return (
    <div className='navbar'>
      <div className ='nav-logo'>
        <Link to='/' style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => setMenu("Inventory")}>
          <img src={logo} alt='' />
          <p>Automotive</p>
        </Link>
      </div>
      <ul className="nav-menu">
        <li onClick={() => setMenu("Inventory")}><Link style={{ textDecoration: 'none' }} to='/'>Inventory</Link>{menu === "Inventory" && <hr />}</li>
        <li onClick={() => setMenu("New cars")}><Link style={{ textDecoration: 'none' }} to='/new-cars'>New cars</Link>{menu === "New cars" && <hr />}</li>
        <li onClick={() => setMenu("Used cars")}><Link style={{ textDecoration: 'none' }} to='/used-cars'>Used cars</Link>{menu === "Used cars" && <hr />}</li>
        <li onClick={() => setMenu("Offers")}><Link style={{ textDecoration: 'none' }} to='/offers'>Offers</Link>{menu === "Offers" && <hr />}</li>
      </ul>
      <div className="nav-login-cart">
        {!isLoggedIn ? (
          <Link to='/login'><button>Login</button></Link>
        ) : (
          <>
            {userRole === 'admin' && (
              <Link to='/admin'><button className='admin-btn'>Admin Panel</button></Link>
            )}
            <button onClick={handleLogout} className='logout-btn'>Logout</button>
          </>
        )}
        <div className="nav-cart-container">
          <Link to='/cart'><img src={cart_icon} alt="" /></Link>
          <div className="nav-cart-count">{getTotalCartItems()}</div>
        </div>
      </div>
    </div>
  )
}

export default Navbar