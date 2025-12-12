import React from 'react'
import './Sidebar.css'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='admin-sidebar'>
      <Link to={'/admin/addproduct'} style={{textDecoration:"none"}}>
        <div className="admin-sidebar-item">
            <p>Add Product</p>
        </div>
      </Link>
      <Link to={'/admin/listproduct'} style={{textDecoration:"none"}}>
        <div className="admin-sidebar-item">
            <p>List Product</p>
        </div>
      </Link>
    </div>
  )
}

export default Sidebar