import React from 'react';

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard">
            <div className="admin-page-header">
                <h1>Dashboard</h1>
            </div>

            <div className="dashboard-content">
                <div style={{ background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    <h2>Welcome to the Admin Panel</h2>
                    <p>Use the sidebar to manage cars and view orders.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
