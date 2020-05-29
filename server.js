const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const colors = require('colors');
const asyncHandler = require('./middleware/async');
const Cart = require('./model/Cart');
const cors = require('cors');

// Load env vars
dotenv.config({
  path: './config/config.env',
});

const app = express();

const router = express.Router();

// Body parser
app.use(express.json());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Connect to mongodb
connectDB();

console.log(`${process.env.PORT}`);

app.use(cors());
// routes

//getCarts
app.get('/api/v1/cart', async function (req, res, next) {
  let carts = await Cart.find();
  res.status(200).json({
    success: true,
    count: carts.length,
    data: carts,
  });
});

//addToCart
app.post('/api/v1/cart', async function (req, res, next) {
  const course = await Cart.exists({ 'course._id': req.body.course._id });
  if (course) {
    return res.status(400).json({
      message: 'Course already in cart.',
    });
  }

  const cart = await Cart.create(req.body);
  res.status(200).json({
    success: true,
  });
});

//deletefromCart
app.delete('/api/v1/cart/:id', async function (req, res, next) {
  const course = await Cart.findById(req.params.id);

  if (!course) {
    res.status(400).json({
      success: false,
      data: 'Not such course',
    });
  }

  await Cart.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
  });
});

//deleteFromCart = () => {};

const PORT = process.env.PORT || 5000;

const HOST = '0.0.0.0';

const server = app.listen(
  PORT,
  HOST,
  console.log(`Server running on port ${PORT}`.yellow.bold)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});
