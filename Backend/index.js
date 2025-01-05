const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db')
const authRoutes = require('./routes/auth');
// This import in the index.js is must
// this is because we want to access our .env files
// i have download a package called 'dotenv'
require("dotenv").config();

// intializing Express 
const app = express();

// middle wares
app.use(cors());
app.use(express.json());

// Connecting DataBase
connectDB()


// Routes
app.use('/api/auth', authRoutes)

// Intializing the server
app.listen(5000, () => console.log('Backend running on http://localhost:5000'));
