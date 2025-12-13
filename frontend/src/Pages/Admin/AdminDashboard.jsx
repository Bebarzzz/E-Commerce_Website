import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your car inventory and orders</p>
      </div>

      <div className="admin-cards">
        <Link to="/admin/add-car" className="admin-card">
          <div className="card-icon">🚗</div>
          <h3>Add New Car</h3>
          <p>Add new vehicles to your inventory</p>
        </Link>

        <div className="admin-card coming-soon">
          <div className="card-icon">📋</div>
          <h3>Manage Cars</h3>
          <p>View, edit, and remove existing cars</p>
          <span className="badge">Coming Soon</span>
        </div>

        <div className="admin-card coming-soon">
          <div className="card-icon">📦</div>
          <h3>Orders</h3>
          <p>View and manage customer orders</p>
          <span className="badge">Coming Soon</span>
        </div>

        <div className="admin-card coming-soon">
          <div className="card-icon">👥</div>
          <h3>Users</h3>
          <p>Manage user accounts and permissions</p>
          <span className="badge">Coming Soon</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
