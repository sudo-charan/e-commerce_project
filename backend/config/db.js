const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Change if you have a different MySQL user
  password: '',  // Change if you have set a password
  database: 'nittekart_db', // ✅ Correct database name
});

db.connect((err) => {
  if (err) {
    console.error('❌ Database Connection Failed:', err.sqlMessage || err);
  } else {
    console.log('✅ MySQL Connected!');
  }
});

module.exports = db;
