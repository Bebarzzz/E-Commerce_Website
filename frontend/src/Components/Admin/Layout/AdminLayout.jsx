/* Admin Layout */
import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { getCurrentUserEmail, logoutUser } from '../../../services/userService';
import './Admin.css';

const AdminLayout = () => {
    const navigate = useNavigate();
    const userEmail = getCurrentUserEmail();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    return (
        <div className="admin-container">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <h2>Admin Panel</h2>
                </div>
                <ul className="sidebar-menu">
                    <li>
                        <NavLink to="/admin" end className={({ isActive }) => isActive ? 'active' : ''}>
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/cars" end className={({ isActive }) => isActive ? 'active' : ''}>
                            Manage Cars
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/cars/new" className={({ isActive }) => isActive ? 'active' : ''}>
                            Add New Car
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'active' : ''}>
                            Orders
                        </NavLink>
                    </li>
                    <li>
                        <Link to="/">
                            Back to Store
                        </Link>
                    </li>
                </ul>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                {/* Topbar */}
                <header className="admin-topbar">
                    <div className="user-info">
                        <span>{userEmail || 'Admin'}</span>
                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="admin-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
