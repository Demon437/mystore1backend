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

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Updated MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Updated to use standard concatenation
  },
});
const upload = multer({ storage });

const mockUsers = [
  { email: 'eve.holt@reqres.in', password: 'tailwind' },
];

app.post('/products', upload.single('pimage'), async (req, res) => {
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

app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching products');
  }
});

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

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const user = mockUsers.find((u) => u.email === email && u.password === password);

  if (user) {
    return res.status(200).json({
      message: 'Login successful',
      token: 'mock-token-123456',
    });
  } else {
    return res.status(401).json({
      error: 'Invalid email or password',
    });
  }
});

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
