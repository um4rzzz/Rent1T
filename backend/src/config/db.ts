import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// Parse MySQL URL if provided, otherwise use individual env vars
function getDbConfig() {
  const mysqlUrl = process.env.MYSQL_URL;
  
  if (mysqlUrl && mysqlUrl.startsWith('mysql://')) {
    // Parse connection string: mysql://user:pass@host:port/database
    console.log('🔵 [DB] Using MYSQL_URL connection string');
    const url = new URL(mysqlUrl);
    const config = {
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      user: url.username,
      password: url.password ? '***' : '(empty)',
      database: url.pathname.slice(1), // Remove leading '/'
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };
    console.log('🔵 [DB] Config:', { ...config, password: config.password ? '***' : '(empty)' });
    return {
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };
  } else {
    // Use individual environment variables
    console.log('🔵 [DB] Using individual DB_* environment variables');
    const config = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'rent1t',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };
    console.log('🔵 [DB] Config:', { ...config, password: config.password ? '***' : '(empty)' });
    console.log('🔵 [DB] Set MYSQL_URL or DB_* variables in .env file');
    return config;
  }
}

const pool = mysql.createPool(getDbConfig());

pool.getConnection()
  .then(conn => {
    console.log('MySQL connected!');
    conn.release();
  })
  .catch(err => {
    console.error('MySQL connection failed:', err);
  });

export default pool;
