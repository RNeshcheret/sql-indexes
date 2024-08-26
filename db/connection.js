const mysql = require("mysql2/promise");

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  //   namedPlaceholders: true,
});

const getConnection = async () => {
  const connection = await pool.getConnection();
  return connection;
};

const releaseConnection = async (connection) => {
  if (connection) await connection.release();
};

module.exports = {
  getConnection,
  releaseConnection,
};
