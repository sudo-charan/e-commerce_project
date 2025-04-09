import React from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./adminComponents/AdminSidebar"; // make sure this path is correct
import "./styles/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div className="admin-dashboard-wrapper">
      <AdminSidebar
        onLogout={handleLogout}
      />

      <div className="admin-dashboard-content">
        <h1>Admin Dashboard</h1>
        <div className="admin-options">
          <div className="admin-card" onClick={() => handleNavigation("/admin/products")}>
            <h3>Manage Products</h3>
            <p>Add, edit, or delete products</p>
          </div>

          <div className="admin-card" onClick={() => handleNavigation("/admin/users")}>
            <h3>Manage Users</h3>
            <p>View and manage user accounts</p>
          </div>

          <div className="admin-card" onClick={() => handleNavigation("/admin/orders")}>
            <h3>Manage Orders</h3>
            <p>Track and update orders</p>
          </div>

          <div className="admin-card" onClick={() => handleNavigation("/admin/payments")}>
            <h3>Manage Payments</h3>
            <p>View payment history</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
