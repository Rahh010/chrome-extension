const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB error:', err));


const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

app.listen(5000, () => console.log('Backend running on http://localhost:5000'));
