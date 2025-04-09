const db = require("../config/db");
const fs = require("fs");
const path = require("path");

// ✅ Utility: Get all categories
const getCategoryNameById = async (id) => {
  const [rows] = await db.promise().query("SELECT category_name FROM category WHERE category_id = ?", [id]);
  return rows.length ? rows[0].category_name : "Unknown";
};

// ✅ 1. Get all products (optionally grouped by section if needed)
exports.getAllProducts = async (req, res) => {
  try {
    const [products] = await db.promise().query("SELECT * FROM product");
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Error fetching products" });
  }
};

// ✅ 2. Get products by category name
exports.getProductsByCategory = async (req, res) => {
  const { categoryName } = req.params;
  try {
    const [category] = await db.promise().query("SELECT category_id FROM category WHERE category_name = ?", [categoryName]);
    if (!category.length) {
      return res.status(404).json({ message: "Category not found" });
    }

    const categoryId = category[0].category_id;
    const [products] = await db.promise().query("SELECT * FROM product WHERE category_id = ?", [categoryId]);

    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products by category:", err);
    res.status(500).json({ message: "Error fetching products by category" });
  }
};

// ✅ 3. Add product
exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category_id, section } = req.body;
    const image = req.file ? `/productImgs/${req.file.filename}` : null;

    const sql = "INSERT INTO product (name, description, price, stock, category_id, section, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [name, description, price, stock, category_id || null, section || null, image];

    await db.promise().query(sql, values);
    res.status(201).json({ message: "Product added successfully" });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ message: "Error adding product" });
  }
};

// ✅ 4. Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category_id, section } = req.body;

    let imageUrl;
    if (req.file) {
      imageUrl = `/productImgs/${req.file.filename}`;

      // Delete previous image if exists
      const [oldData] = await db.promise().query("SELECT image_url FROM product WHERE product_id = ?", [id]);
      const oldImagePath = oldData[0]?.image_url ? path.join("public", oldData[0].image_url) : null;
      if (oldImagePath && fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const sql = `
      UPDATE product SET
      name = ?, description = ?, price = ?, stock = ?, category_id = ?, section = ?
      ${imageUrl ? ", image_url = ?" : ""}
      WHERE product_id = ?
    `;
    const values = [name, description, price, stock, category_id || null, section || null];
    if (imageUrl) values.push(imageUrl);
    values.push(id);

    await db.promise().query(sql, values);
    res.status(200).json({ message: "Product updated successfully" });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: "Error updating product" });
  }
};

// ✅ 5. Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete image file
    const [product] = await db.promise().query("SELECT image_url FROM product WHERE product_id = ?", [id]);
    const imagePath = product[0]?.image_url ? path.join("public", product[0].image_url) : null;

    if (imagePath && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await db.promise().query("DELETE FROM product WHERE product_id = ?", [id]);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Error deleting product" });
  }
};
