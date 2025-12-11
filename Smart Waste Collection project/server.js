const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('frontend'));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/waste-optimizer';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
const binRoutes = require('./backend/routes/binRoutes');
const optimizationRoutes = require('./backend/routes/optimizationRoutes');
const comparisonRoutes = require('./backend/routes/comparisonRoutes');
const simulationRoutes = require('./backend/routes/simulationRoutes');

app.use('/api/bins', binRoutes);
app.use('/api/optimize', optimizationRoutes);
app.use('/api/comparison', comparisonRoutes);
app.use('/api/simulate', simulationRoutes);

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/frontend/index.html');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});




