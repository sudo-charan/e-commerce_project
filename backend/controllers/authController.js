const db = require("../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// -------------------- Register User --------------------
exports.register = (req, res) => {
  const { fullName, email, mobile, gender, password } = req.body;

  if (!fullName || !email || !mobile || !gender || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const checkUserSql = "SELECT * FROM users WHERE email = ? OR mobile = ?";
  db.query(checkUserSql, [email, mobile], (err, results) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (results.length > 0) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const insertSql = "INSERT INTO users (full_name, email, mobile, gender, password) VALUES (?, ?, ?, ?, ?)";
    db.query(insertSql, [fullName, email, mobile, gender, password], (err) => {
      if (err) {
        console.error("Insert Error:", err);
        return res.status(500).json({ success: false, message: "Failed to register user" });
      }

      res.json({ success: true, message: "User registered successfully" });
    });
  });
};

// -------------------- Login User/Admin --------------------
exports.login = (req, res) => {
  const { emailOrPhone, password, isAdmin } = req.body;

  if (!emailOrPhone || !password) {
    return res.status(400).json({ success: false, message: "Email/Phone and password are required" });
  }

  // Always query from users table (admins are treated as special users)
  const sql = `SELECT * FROM users WHERE email = ? OR mobile = ?`;

  db.query(sql, [emailOrPhone, emailOrPhone], (err, results) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const user = results[0];

    if (user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // You can later enhance this by checking a "role" column in the users table
    const role = isAdmin ? "admin" : "user";

    const tokenPayload = {
      id: user.user_id,
      email: user.email,
      role: role
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      success: true,
      token,
      username: user.full_name
    });
  });
};
