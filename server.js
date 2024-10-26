// server.js
const express = require('express');
const next = require('next');
const mysql = require('mysql2');
const multer = require('multer');
const cors = require('cors');
const sharp = require('sharp');
require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();
    server.use(cors());
    server.use(express.json());

    // Configure multer for handling file uploads
    const storage = multer.memoryStorage();
    const upload = multer({ 
        storage: storage,
        limits: {
            fileSize: 5 * 1024 * 1024 // 5MB limit
        }
    });

    // MySQL Connection
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'hamin123',
        database: 'Chailai',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    }).promise();

    // Helper function to convert BLOB to base64
    function blobToBase64(blob) {
        return blob ? `data:image/jpeg;base64,${blob.toString('base64')}` : null;
    }

    // Image processing function
    async function processImage(buffer) {
        try {
            const processedImage = await sharp(buffer)
                .resize(800, 800, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .jpeg({
                    quality: 80,
                    progressive: true
                })
                .toBuffer();

            return processedImage;
        } catch (error) {
            console.error('Error processing image:', error);
            throw error;
        }
    }

    // Check database connection
    async function testConnection() {
        try {
            const connection = await pool.getConnection();
            console.log('Connected to the database using mysql2');
            connection.release();
        } catch (err) {
            console.error('Database connection failed:', err);
        }
    }
    testConnection();

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
      
    function isValidPassword(password) {
        return /^\d{8}$/.test(password);  // Ensures exactly 8 numeric digits
    }

    // Routes
    // 1. Register new customer
    server.post('/api/customers', upload.single('picture'), async (req, res) => {

        console.log('Request Body:', req.body);  // Logs form data fields
        console.log('File:', req.file);

        try {
            const {
                firstName,
                lastName,
                email,
                password,
                university,
                age
            } = req.body;
    
            // Validation
            if (!firstName || !lastName || !email || !password || !university) {
                return res.status(400).json({ error: 'All required fields must be filled' });
            }
    
            if (!isValidEmail(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }
    
            if (!isValidPassword(password)) {
                return res.status(400).json({ error: 'Password must be exactly 8 digits' });
            }
    
            // Check if email already exists
            const [existingUsers] = await pool.query(
                'SELECT email FROM customer WHERE email = ?',
                [email]
            );
    
            if (existingUsers.length > 0) {
                return res.status(409).json({ error: 'Email already registered' });
            }
    
            // Process image if it exists
            let processedPicture = null;
            if (req.file) {
                try {
                    processedPicture = await processImage(req.file.buffer);
                } catch (error) {
                    return res.status(400).json({ error: 'Invalid image format or corrupted file' });
                }
            }
    
            // Insert new customer
            const query = `
                INSERT INTO customer 
                (firstName, lastName, email, password, university, age, picture) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
    
            console.log('Inserting new customer into database...');
            const [result] = await pool.query(query, [
                firstName,
                lastName,
                email,
                parseInt(password),
                university,
                age || null,
                processedPicture
            ]);
            console.log('Customer inserted with ID:', result.insertId);
    
            res.status(201).json({
                message: 'Customer registered successfully',
                customerId: result.insertId
            });
    
        } catch (error) {
            console.error('Registration error:', error);
            if (error.code === 'ER_DATA_TOO_LONG') {
                res.status(400).json({ error: 'Image size too large even after processing' });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    });

    server.get('/api/customers/:id', async (req, res) => {
        console.log('GET request received for customer ID:', req.params.id);
        
        try {
            // Validate ID parameter
            const customerId = parseInt(req.params.id, 10);
            if (isNaN(customerId)) {
                console.log('Invalid ID format:', req.params.id);
                return res.status(400).json({ error: 'Invalid customer ID format' });
            }
    
            // Query database with prepared statement
            const [rows] = await pool.query(
                `SELECT 
                    customer_id, 
                    firstName, 
                    lastName, 
                    email, 
                    university, 
                    age, 
                    picture 
                FROM customer 
                WHERE customer_id = ?`,
                [customerId]
            );
    
            console.log('Query executed, found rows:', rows.length);
    
            if (rows.length === 0) {
                return res.status(404).json({ 
                    error: 'Customer not found',
                    requestedId: customerId 
                });
            }
    
            // Handle potential null picture
            const picture = rows[0].picture ? blobToBase64(rows[0].picture) : null;
    
            // Construct response object
            const customer = {
                ...rows[0],
                picture: picture
            };
    
            // Remove sensitive fields if any
            delete customer.password;  // If password field exists
            
            console.log('Successfully retrieved customer:', customer.customer_id);
            res.status(200).json(customer);
    
        } catch (error) {
            console.error('Error fetching customer:', error);
            res.status(500).json({ 
                error: 'Internal server error',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    });

    server.delete('/api/customers/:id', async (req, res) => {
        console.log('Delete request received for customer ID:', req.params.id);
    
        try {
            // Validate ID
            const customerId = parseInt(req.params.id, 10);
            if (isNaN(customerId)) {
                console.log('Invalid ID format:', req.params.id);
                return res.status(400).json({ error: 'Invalid customer ID format' });
            }

            // Check if customer exists first
            const [customer] = await pool.query(
                'SELECT customer_id FROM customer WHERE customer_id = ?',
                [customerId]
            );

            if (customer.length === 0) {
                console.log('Customer not found:', customerId);
                return res.status(404).json({ error: 'Customer not found' });
            }

            // Proceed with deletion
            const [result] = await pool.query(
                'DELETE FROM customer WHERE customer_id = ?',
                [customerId]
            );

            console.log('Delete operation result:', result);
            res.status(200).json({ 
                message: 'Customer deleted successfully',
                affectedRows: result.affectedRows
            });
        
        }   catch (error) {
            console.error('Error deleting customer:', error);
            res.status(500).json({ 
                error: 'Internal server error',
                details: error.message
            });
        }
    });

    server.post('/api/login', async (req, res) => {
        console.log('Login attempt received');
        
        try {
            const { email, password } = req.body;
    
            // Validate input
            if (!email || !password) {
                return res.status(400).json({
                    error: 'Email and password are required'
                });
            }
    
            // Check email format
            if (!isValidEmail(email)) {
                return res.status(400).json({
                    error: 'Invalid email format'
                });
            }
    
            // Check password format (must be exactly 8 digits)
            if (!isValidPassword(password)) {
                return res.status(400).json({
                    error: 'Invalid password format'
                });
            }
    
            // Query database for user
            const [rows] = await pool.query(
                `SELECT 
                    customer_id,
                    firstName,
                    lastName,
                    email,
                    password,
                    university,
                    age
                FROM customer 
                WHERE email = ?`,
                [email]
            );
    
            // Check if user exists
            if (rows.length === 0) {
                return res.status(401).json({
                    error: 'Invalid email or password'
                });
            }
    
            const user = rows[0];
    
            // Check password (converting string password to integer for comparison)
            if (parseInt(password) !== user.password) {
                return res.status(401).json({
                    error: 'Invalid email or password'
                });
            }
    
            // Successful login - return user data (excluding password)
            const userData = {
                customer_id: user.customer_id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                university: user.university,
                age: user.age
            };
    
            res.status(200).json({
                message: 'Login successful',
                user: userData
            });
    
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    });

    // Handle other Next.js routes
    server.all('*', (req, res) => handle(req, res));

    server.listen(3000, (err) => {
        if (err) throw err;
        console.log('Server running on http://localhost:3000');
    });
});
