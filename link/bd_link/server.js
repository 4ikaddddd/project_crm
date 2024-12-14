const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const linkRoutes = require('./routes/linkRoutes');

const app = express();
const PORT = 1000;
const MONGODB_URI = 'mongodb+srv://k3655692:1WCBuJz8hPlXZCKf@api-2.bqt8pl1.mongodb.net/?retryWrites=true&w=majority&appName=api-2';

// Настройки CORS
app.use(cors());

app.use(express.json());
app.use('/links', linkRoutes);

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Connection error', err.message);
  });
