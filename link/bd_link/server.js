const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const linkRoutes = require('./routes/linkRoutes');

const app = express();
const PORT = 1000;
const MONGODB_URI = 'mongodb+srv://k3655692:0MWNnYZUnSJWIJS1@cluster0.ucimtew.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Настройки CORS
app.use(cors());

app.use(express.json());
app.use('/api', linkRoutes);

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
