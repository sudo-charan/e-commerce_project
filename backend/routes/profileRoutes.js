const express = require("express");
const router = express.Router();
const db = require("../config/db"); // ✅ Fixed path

// ✅ GET user profile by ID
router.get("/:id", (req, res) => {
  const userId = req.params.id;
  const sql = "SELECT full_name AS name, email, mobile AS phone, address FROM users WHERE user_id = ?";

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(404).json({ error: "User not found" });
    res.json(results[0]);
  });
});

// ✅ PUT update user profile by ID
router.put("/:id", (req, res) => {
  const userId = req.params.id;
  const { name, email, phone, address } = req.body;

  const sql = "UPDATE users SET full_name = ?, email = ?, mobile = ?, address = ? WHERE user_id = ?";

  db.query(sql, [name, email, phone, address, userId], (err, result) => {
    if (err) return res.status(500).json({ error: "Update failed" });
    res.json({ message: "Profile updated successfully" });
  });
});

module.exports = router;
