const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const https = require('https');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://sandaligeethmadias_db_user:Sands0528@cluster0.wrijfks.mongodb.net/easylodge?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('DB Error:', err));

app.use('/api/boarders', require('./routes/boarders'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Keep alive ping every 5 minutes
  setInterval(() => {
    https.get('https://easylodge-backend-production.up.railway.app/api/boarders', (res) => {
      console.log('Keep alive ping sent');
    }).on('error', (err) => {
      console.log('Ping error:', err);
    });
  }, 5 * 60 * 1000);

});