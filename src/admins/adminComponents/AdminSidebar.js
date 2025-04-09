import React from "react";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaUsers,
  FaMoneyCheckAlt,
  FaSignOutAlt,
  FaClipboardList,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; // ✅ Use Link
import "./AdminSidebar.css";

const AdminSidebar = ({
  adminName = "Admin",
  adminEmail = "admin@example.com",
  onLogout,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout(); // Clear storage if needed
    navigate("/"); // Redirect to Home
  };

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
        <Link to="/admin/dashboard"><FaTachometerAlt /> Dashboard</Link>
        <Link to="/admin/products"><FaBoxOpen /> Products</Link>
        <Link to="/admin/orders"><FaClipboardList /> Orders</Link>
        <Link to="/admin/users"><FaUsers /> Users</Link>
        <Link to="/admin/payments"><FaMoneyCheckAlt /> Payments</Link>
      </nav>

      <div className="admin-logout">
        <button onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
