const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db')
const authRoutes = require('./routes/auth');
const folderRoutes = require('./routes/folder')
const sharedUsers = require('./routes/sharedUsers')
const cookieParser = require('cookie-parser');

// Require the cloudinary library
const cloudinary = require('cloudinary').v2;

// This import in the index.js is must
// this is because we want to access our .env files
// i have download a package called 'dotenv'
require("dotenv").config();


console.log('Email User:', process.env.EMAIL_USER);
console.log('App Password:', process.env.APP_PASS);

// intializing Express 
const app = express();

// middle wares
const corsOptions = {
  origin: ['chrome-extension://ckcnkmabijojbgikmmhifblfiemomgpj'], // Replace with your actual extension ID
  credentials: true, // Allows sending cookies with requests
};

app.use(cors(corsOptions))
app.use(express.json());
app.use(cookieParser());

// Connecting DataBase
connectDB()

// Cloudinary config which is used to identify its my cloud
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
  secure: true, // Enforces HTTPS by default
});


// Routes
app.use('/api/auth', authRoutes) // Authentication routes
app.use('/api/folder', folderRoutes) // Folder routes
app.use('/api/sharedUsers', sharedUsers) // Shared users routes

// Intializing the server
app.listen(5000, () => console.log('Backend running on http://localhost:5000'));
