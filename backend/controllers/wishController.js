// controllers/wishlistController.js
const db = require('../config/db');

exports.addToWishlist = (req, res) => {
  const { userId, productId } = req.body;
  const query = "INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)";
  db.query(query, [userId, productId], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to add to wishlist" });
    res.status(200).json({ message: "Product added to wishlist" });
  });
};

exports.getWishlistByUser = (req, res) => {
  const { userId } = req.params;
  const query = `
    SELECT w.*, p.name, p.description, p.price, p.image_url 
    FROM wishlist w 
    JOIN products p ON w.product_id = p.product_id 
    WHERE w.user_id = ?
  `;
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch wishlist" });
    res.status(200).json(results);
  });
};

exports.removeFromWishlist = (req, res) => {
  const { userId, productId } = req.body;
  const query = "DELETE FROM wishlist WHERE user_id = ? AND product_id = ?";
  db.query(query, [userId, productId], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to remove from wishlist" });
    res.status(200).json({ message: "Product removed from wishlist" });
  });
};
