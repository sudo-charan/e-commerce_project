const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ✅ Get all orders with user info
router.get('/all-orders', (req, res) => {
  const sql = `
    SELECT 
      o.order_id, 
      o.user_id, 
      u.name AS user_name, 
      o.status, 
      o.total_amount, 
      o.created_at 
    FROM 
      orders o 
    JOIN 
      users u ON o.user_id = u.user_id 
    ORDER BY 
      o.created_at DESC`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Failed to fetch orders:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results);
  });
});

// ✅ Update order status
router.put('/update-status/:orderId', (req, res) => {
  const { status } = req.body;
  const { orderId } = req.params;

  if (!status) {
    return res.status(400).json({ error: "Status is required." });
  }

  const sql = `UPDATE orders SET status = ? WHERE order_id = ?`;
  db.query(sql, [status, orderId], (err, result) => {
    if (err) {
      console.error("Failed to update order status:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ message: "Order status updated successfully." });
  });
});

module.exports = router;
