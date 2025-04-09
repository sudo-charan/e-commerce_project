require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// ✅ DB Connection
const db = require("./config/db");

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve static files for uploaded product images
app.use("/productImgs", express.static("public/productImgs"));

// ✅ Route Imports
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const productRoutes = require("./routes/productRoutes");
const userAdminRoutes = require("./routes/userAdminRoutes");
const categoryRoutes = require("./routes/categoryRoutes"); // ✅ NEW

// ✅ Optional: Use this only if orderRoutes.js exists
let orderRoutes;
try {
  orderRoutes = require("./routes/orderRoutes");
  app.use("/api/orders", orderRoutes);
} catch (err) {
  console.warn("orderRoutes.js not found. Skipping orders route.");
}

// ✅ Routes Setup
app.use("/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin/users", userAdminRoutes);
app.use("/api/categories", categoryRoutes); // ✅ NEW
app.use("/products", productRoutes);

// ✅ Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
