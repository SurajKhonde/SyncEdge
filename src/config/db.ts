import mysql from 'mysql2/promise';
import dbConfig from './db.config';
import { table } from './table';

// Define the type for each table configuration in 'table'
interface TableConfig {
  tableName: string;
  query: string;
}

// Create a MySQL connection using the dbConfig
const createConnection = async () => {
  const connection = await mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
    port: Number(dbConfig.PORT),  // Convert to number
  });
  console.log("Successfully connected to the database.");
  return connection;
};

// Function to create a table
const createTable = async (connection: mysql.Connection, query: string): Promise<void> => {
  try {
    await connection.query(query);
    console.log("Table created successfully");
  } catch (err) {
    console.error(`Error creating table:`, err);
  }
};

// Function to insert a user if the admin user doesn't exist
const userInsert = async (connection: mysql.Connection): Promise<void> => {
  const query =
    "INSERT INTO `users` (`email`, `password`, `user_type`, `role`) VALUES ('admin@gmail.com', '$2a$10$4X0Vbh0SG2SZ9QnWoD67Muf/hFHO0nG31N7lbBnSwe39ZwF9lsYZK', '1', 'Global Admin');";
  const checkAdmin = "SELECT * FROM users WHERE email='admin@gmail.com'";

  try {
    const [rows] = await connection.query(checkAdmin); // rows will be an array for SELECT queries
    if (Array.isArray(rows) && rows.length === 0) { // Check if 'rows' is an array and empty
      await connection.query(query); // Proceed to insert if the admin doesn't exist
      console.log("Data inserted successfully");
    } else {
      console.log("Admin user already exists");
    }
  } catch (err) {
    console.error("Error checking or inserting admin user:", err);
  }
};

// Function to check and create tables
const checkAndCreateTables = async (connection: mysql.Connection) => {
  for (const e of table) {
    const checkTableSQL = `SHOW TABLES LIKE '${e.tableName}'`;

    try {
      const [results] = await connection.query(checkTableSQL); // This is for SHOW TABLES query, which returns rows
      if (Array.isArray(results) && results.length === 0) { // Ensure results is an array
        await createTable(connection, e.query);
      } else {
        console.log(`${e.tableName} table already exists`);
      }
    } catch (err) {
      console.error(`Error checking ${e.tableName} table:`, err);
    }
  }
};

// Main execution
const init = async () => {
  const connection = await createConnection();
  await checkAndCreateTables(connection);
  await userInsert(connection);
};

init().catch((err) => console.error("Error initializing database:", err));

export default createConnection;
