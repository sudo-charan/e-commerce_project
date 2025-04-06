const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all users
router.get('/all', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Get all payments
router.get("/payments", (req, res) => {
  const sql = "SELECT * FROM payments ORDER BY payment_date DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching payments:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});


// Delete user
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM users WHERE user_id=?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'User deleted successfully' });
  });
});

module.exports = router;
