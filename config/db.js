// config/db.js
import { createConnection } from 'mysql2';
import { config } from 'dotenv';

config();

// Create a connection to the database
const connection = createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// A wrapper function for queries that returns a Promise
const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Optional: Add a connection check (good practice)
connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        // It's crucial here: if you export 'connection' and 'query'
        // and you can't connect, you might want to consider exiting
        // the process or having a robust retry mechanism.
        return;
    }
    console.log('Connected to database as id ' + connection.threadId);
});

// Export both the connection and the query helper as NAMED exports
export { connection, query };