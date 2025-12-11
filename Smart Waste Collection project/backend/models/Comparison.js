const mongoose = require('mongoose');

const comparisonSchema = new mongoose.Schema({
  testCase: {
    type: String,
    required: true
  },
  astar: {
    distance: Number,
    time: Number,
    fuelCost: Number,
    computationTime: Number,
    binsCollected: Number
  },
  genetic: {
    distance: Number,
    time: Number,
    fuelCost: Number,
    computationTime: Number,
    binsCollected: Number
  },
  improvement: {
    distance: Number,
    time: Number,
    fuelCost: Number,
    computationTime: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comparison', comparisonSchema);




