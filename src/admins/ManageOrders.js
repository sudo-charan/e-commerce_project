// src/pages/admin/ManageOrders.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./adminComponents/AdminSidebar";
import "./styles/ManageOrders.css";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders/all-orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await axios.put(`http://localhost:5000/api/orders/update-status/${orderId}`, {
        status: newStatus,
      });
      fetchOrders();
    } catch (err) {
      console.error("Error updating order status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p className="loading-msg">Loading orders...</p>;

  return (
    <div className="admin-dashboard-wrapper">
      <AdminSidebar />
      <div className="manage-orders">
        <h2>Manage Orders</h2>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Status</th>
              <th>Total</th>
              <th>Date</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.user_name}</td>
                <td>{order.status}</td>
                <td>₹{order.total_amount}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.order_id, e.target.value)}
                    disabled={updatingId === order.order_id}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrders;
