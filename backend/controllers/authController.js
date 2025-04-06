const db = require("../config/db");

exports.register = (req, res) => {
  const { fullName, email, gender, mobile, password } = req.body;
  const full_name = fullName;

  if (!full_name || !email || !gender || !mobile || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const checkUserSql = "SELECT * FROM users WHERE email = ? OR mobile = ?";
  db.query(checkUserSql, [email, mobile], (err, existingUsers) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const insertSql = "INSERT INTO users (full_name, email, gender, mobile, password) VALUES (?, ?, ?, ?, ?)";
    db.query(insertSql, [full_name, email, gender, mobile, password], (err, result) => {
      if (err) {
        console.error("DB Insert Error:", err);
        return res.status(500).json({ success: false, message: "Registration failed" });
      }

      return res.status(201).json({ success: true, message: "User registered successfully" });
    });
  });
};

exports.login = (req, res) => {
  const { emailOrPhone, password, isAdmin } = req.body;

  if (!emailOrPhone || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  if (isAdmin) {
    const adminSql = "SELECT * FROM admins WHERE (email = ? OR phone = ?) AND password = ?";
    db.query(adminSql, [emailOrPhone, emailOrPhone, password], (err, admins) => {
      if (err) {
        console.error("Admin Login Error:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }

      if (admins.length === 0) {
        return res.status(401).json({ success: false, message: "Invalid admin credentials" });
      }

      return res.status(200).json({
        success: true,
        message: "Admin login successful",
        username: admins[0].name,
        isAdmin: true,
      });
    });
  } else {
    const userSql = "SELECT * FROM users WHERE (email = ? OR mobile = ?) AND password = ?";
    db.query(userSql, [emailOrPhone, emailOrPhone, password], (err, users) => {
      if (err) {
        console.error("User Login Error:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }

      if (users.length === 0) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

      return res.status(200).json({
        success: true,
        message: "Login successful",
        username: users[0].full_name,
        isAdmin: false,
      });
    });
  }
};
