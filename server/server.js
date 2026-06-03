const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/weather', require('./routes/weather'));
app.use('/api/saved-dates', require('./routes/savedDates'));

// Test route
app.get('/', (req, res) => {
  res.send('Farmer Weather App Server is Running!');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log('❌ MongoDB Connection Failed:', error.message);
  });