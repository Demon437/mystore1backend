const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const Product = require('./models/Product');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Configure CORS to allow requests from your frontend URL
app.use(
  cors({
    origin: ['https://mystore1-4usx.onrender.com', 'http://localhost:3000'], // Allow your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Allow cookies if needed
  })
);

app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Mock users for login
const mockUsers = [
  { email: 'eve.holt@reqres.in', password: 'tailwind' },
];

// Add Product API
app.post('/api/products', upload.single('pimage'), async (req, res) => {
  try {
    const { pname, pprice } = req.body;

    if (!pname || !pprice) {
      return res.status(400).send('Product name and price are required.');
    }

    const existingProduct = await Product.findOne({ pname });
    if (existingProduct) {
      return res.status(400).send('Product with this name already exists.');
    }

    const product = new Product({
      pname,
      pprice,
      pimage: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await product.save();
    res.status(201).send('Product added successfully!');
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).send('Error adding product');
  }
});

// Get All Products API
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching products');
  }
});

// Get Product by ID API
app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send('Product not found');
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching product');
  }
});

// Login API
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const user = mockUsers.find((u) => u.email === email && u.password === password);

  if (user) {
    return res.status(200).json({
      message: 'Login successful',
      token: 'mock-token-123456', // Mock token for simplicity
    });
  } else {
    return res.status(401).json({
      error: 'Invalid email or password',
    });
  }
});

// Serve React build files
app.use(express.static(path.join(__dirname, 'build')));

// Handle all other routes and serve React's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

// Root Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
