require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// ✅ DB Connection
const db = require("./config/db");

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Route Imports
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const productRoutes = require("./routes/productRoutes");
const userAdminRoutes = require("./routes/userAdminRoutes");

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


// ✅ Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
