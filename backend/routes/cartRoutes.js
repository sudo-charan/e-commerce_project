// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Add to cart
router.post('/add', (req, res) => {
  const { userId, productId, quantity } = req.body;
  const query = "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?";
  db.query(query, [userId, productId, quantity, quantity], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to add to cart" });
    res.status(200).json({ message: "Product added to cart" });
  });
});

// Get user's cart
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const query = `
    SELECT c.*, p.name, p.description, p.price, p.image_url 
    FROM cart c 
    JOIN products p ON c.product_id = p.product_id 
    WHERE c.user_id = ?
  `;
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch cart items" });
    res.status(200).json(results);
  });
});

// Remove from cart
router.post('/remove', (req, res) => {
  const { userId, productId } = req.body;
  const query = "DELETE FROM cart WHERE user_id = ? AND product_id = ?";
  db.query(query, [userId, productId], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to remove from cart" });
    res.status(200).json({ message: "Product removed from cart" });
  });
});

module.exports = router;
