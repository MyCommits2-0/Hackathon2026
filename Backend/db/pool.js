const mysql2 = require('mysql2');

// Create connection pool
const pool = mysql2.createPool({
    host: 'localhost',
    user: 'root',
    password: 'manager',
    database: 'admission_management_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Optional: Promise wrapper (recommended)
const promisePool = pool.promise();

// Test connection
promisePool.getConnection()
    .then(connection => {
        console.log(" MySQL Connected Successfully");
        connection.release();
    })
    .catch(err => {
        console.error(" Database connection failed:", err.message);
    });

module.exports = promisePool;