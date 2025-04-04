const db = require("../config/db");

// Create User Table (if not exists)
const createUserTable = () => {
  const sql = `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    mobile VARCHAR(20) UNIQUE,
    gender VARCHAR(10),
    password VARCHAR(255)
  )`;
  db.query(sql, (err) => {
    if (err) console.error("Error creating users table:", err);
  });
};

createUserTable();

module.exports = {
  createUser: (userData, callback) => {
    const sql = "INSERT INTO users (fullName, email, mobile, gender, password) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, userData, callback);
  },
  getUserByEmailOrPhone: (emailOrPhone, callback) => {
    const sql = "SELECT * FROM users WHERE email = ? OR mobile = ?";
    db.query(sql, [emailOrPhone, emailOrPhone], callback);
  },
};
