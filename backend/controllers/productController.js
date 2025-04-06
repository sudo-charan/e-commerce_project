const db = require("../config/db");

// Get products by category_id
exports.getProductsByCategory = (req, res) => {
  const { categoryId } = req.params;
  const query = "SELECT * FROM product WHERE category_id = ?";
  db.query(query, [categoryId], (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
    res.json({ success: true, products: results });
  });
};

// Get all categories
exports.getAllCategories = (req, res) => {
  const query = "SELECT * FROM category";
  db.query(query, (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
    res.json({ success: true, categories: results });
  });
};
