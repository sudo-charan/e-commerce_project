// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const multer = require("multer");
const path = require("path");

// Image upload config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/productImgs");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Helper to build image URL
const getImageUrl = (req, filename) => {
  return `${req.protocol}://${req.get("host")}/productImgs/${filename}`;
};

// Get all products
router.get("/all", (req, res) => {
  db.query("SELECT * FROM product", (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch products" });
    res.json(results);
  });
});

// Get products by category name
router.get("/category/:categoryName", (req, res) => {
  const { categoryName } = req.params;
  const sql = `SELECT p.* FROM product p JOIN category c ON p.category_id = c.category_id WHERE c.category_name = ?`;
  db.query(sql, [categoryName], (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch category products" });
    res.json(results);
  });
});

// Add product
router.post("/add", upload.single("image"), (req, res) => {
  const { name, description, price, stock, category_id, section } = req.body;
  const image = req.file ? getImageUrl(req, req.file.filename) : null;
  const sql = "INSERT INTO product (name, description, price, stock, category_id, section, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const values = [name, description, price, stock, category_id || null, section || null, image];
  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to add product" });
    res.status(201).json({ message: "Product added", product_id: result.insertId });
  });
});

// Update product
router.put("/update/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, category_id, section } = req.body;
  const image = req.file ? getImageUrl(req, req.file.filename) : null;

  let fields = "name = ?, description = ?, price = ?, stock = ?, category_id = ?, section = ?";
  let values = [name, description, price, stock, category_id || null, section || null];
  if (image) {
    fields += ", image_url = ?";
    values.push(image);
  }
  values.push(id);

  const sql = `UPDATE product SET ${fields} WHERE product_id = ?`;
  db.query(sql, values, (err) => {
    if (err) return res.status(500).json({ error: "Update failed" });
    res.json({ message: "Product updated" });
  });
});

// Delete product
router.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM product WHERE product_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: "Delete failed" });
    res.json({ message: "Product deleted" });
  });
});

module.exports = router;
