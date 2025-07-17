// server.js

// 1. Load environment variables
// Use import for dotenv config
import dotenv from 'dotenv';
dotenv.config();

// 2. Import necessary modules
import express from 'express';
import mysql from 'mysql2/promise'; // Use mysql2/promise for async/await
import cors from 'cors'; // For handling Cross-Origin Resource Sharing

// 3. Initialize Express app
const app = express();
const port = process.env.PORT || 3001; // Use port from environment variable or default to 3001

// 4. Middleware
app.use(express.json()); // Enable JSON body parsing for POST/PUT requests
app.use(cors()); // Enable CORS for all routes (important for frontend communication)

// 5. Database Connection Pool Configuration
// Using a connection pool is more efficient for handling multiple requests
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
pool.getConnection()
    .then(connection => {
        console.log('Successfully connected to MySQL database!');
        connection.release(); // Release the connection back to the pool
    })
    .catch(err => {
        console.error('Error connecting to database:', err.message);
        // You might want to exit the process if the database connection is critical
        // process.exit(1);
    });

// 6. Define API Routes

// Root route for testing server status
app.get('/', (req, res) => {
    res.send('Welcome to the MySQL API!');
});

// GET all products
app.get('/api/products', async (req, res) => {
    try {
        // Execute a query using the connection pool
        const [rows] = await pool.execute('SELECT * FROM products');
        res.json(rows); // Send the query results as JSON
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});

// GET a single product by ID
app.get('/api/products/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        // Use parameterized queries to prevent SQL injection
        const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [productId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(rows[0]); // Send the first (and only) row as JSON
    } catch (error) {
        console.error(`Error fetching product with ID ${productId}:`, error);
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
});

// POST a new product
/*app.post('/api/products', async (req, res) => {
    const { name, price, description } = req.body;
    // Basic validation
    if (!name || !price) {
        return res.status(400).json({ message: 'Name and price are required' });
    }
    try {
        const [result] = await pool.execute(
            'INSERT INTO products (name, price, description) VALUES (?, ?, ?)',
            [name, price, description]
        );
        res.status(201).json({
            message: 'Product added successfully',
            productId: result.insertId,
            product: { id: result.insertId, name, price, description }
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Error adding product', error: error.message });
    }
});*/

// 7. Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
