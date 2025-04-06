import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./adminComponents/AdminSidebar"; // ✅ Ensure the path is correct
import "./styles/ManagePayments.css";

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/payments");
      setPayments(response.data);
    } catch (err) {
      setError("Failed to fetch payments.");
      console.error(err);
    }
  };

  return (
    <div className="admin-dashboard-wrapper">
      <AdminSidebar />

      <div className="manage-payments-container">
        <h2>Manage Payments</h2>
        {error && <p className="error">{error}</p>}
        {payments.length === 0 ? (
          <p>No payments found.</p>
        ) : (
          <table className="payments-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Order ID</th>
                <th>Method</th>
                <th>Status</th>
                <th>Transaction ID</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.payment_id}>
                  <td>{payment.payment_id}</td>
                  <td>{payment.order_id}</td>
                  <td>{payment.payment_method}</td>
                  <td>{payment.payment_status}</td>
                  <td>{payment.transaction_id}</td>
                  <td>{new Date(payment.payment_date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManagePayments;
