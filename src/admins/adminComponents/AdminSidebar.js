import React from "react";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaUsers,
  FaMoneyCheckAlt,
  FaSignOutAlt,
  FaClipboardList
} from "react-icons/fa";
import "./AdminSidebar.css";

const AdminSidebar = ({ adminName = "Admin", adminEmail = "admin@example.com", onLogout }) => {
  return (
    <div className="admin-sidebar">
      <div className="admin-header">
        <div className="admin-avatar">{adminName[0]}</div>
        <div className="admin-info">
          <h4>{adminName}</h4>
          <p>{adminEmail}</p>
        </div>
      </div>

      <nav className="admin-nav">
        <a href="/admin/dashboard"><FaTachometerAlt /> Dashboard</a>
        <a href="/admin/products"><FaBoxOpen /> Products</a>
        <a href="/admin/orders"><FaClipboardList /> Orders</a> {/* 👈 Added this */}
        <a href="/admin/users"><FaUsers /> Users</a>
        <a href="/admin/payments"><FaMoneyCheckAlt /> Payments</a>
      </nav>

      <div className="admin-logout">
        <button onClick={onLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
