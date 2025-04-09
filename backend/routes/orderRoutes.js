// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Place Order
router.post('/place', (req, res) => {
  const { userId, products, totalAmount, paymentMethod } = req.body;

  const orderQuery = "INSERT INTO orders (user_id, total_amount, order_date) VALUES (?, ?, NOW())";
  db.query(orderQuery, [userId, totalAmount], (err, orderResult) => {
    if (err) return res.status(500).json({ error: "Order creation failed" });

    const orderId = orderResult.insertId;

    const values = products.map(p => [orderId, p.productId, p.quantity]);
    const itemsQuery = "INSERT INTO order_items (order_id, product_id, quantity) VALUES ?";
    db.query(itemsQuery, [values], (err2) => {
      if (err2) return res.status(500).json({ error: "Order items failed" });

      const paymentQuery = "INSERT INTO payments (order_id, payment_method, payment_status, transaction_id, payment_date) VALUES (?, ?, ?, ?, NOW())";
      const txnId = 'TXN' + Date.now();
      db.query(paymentQuery, [orderId, paymentMethod, 'Paid', txnId], (err3) => {
        if (err3) return res.status(500).json({ error: "Payment failed" });

        res.status(200).json({ message: "Order placed successfully", orderId });
      });
    });
  });
});

// Get user orders
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const query = `
    SELECT o.order_id, o.total_amount, o.order_date, p.payment_status, oi.product_id, pr.name, pr.price, oi.quantity 
    FROM orders o 
    JOIN payments p ON o.order_id = p.order_id
    JOIN order_items oi ON o.order_id = oi.order_id 
    JOIN products pr ON oi.product_id = pr.product_id 
    WHERE o.user_id = ?
  `;
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch orders" });
    res.status(200).json(results);
  });
});

module.exports = router;
