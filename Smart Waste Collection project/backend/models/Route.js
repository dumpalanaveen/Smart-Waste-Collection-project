const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  algorithm: {
    type: String,
    enum: ['astar', 'genetic'],
    required: true
  },
  bins: [{
    binId: String,
    order: Number,
    latitude: Number,
    longitude: Number
  }],
  metrics: {
    totalDistance: {
      type: Number,
      required: true
    },
    estimatedTime: {
      type: Number,
      required: true
    },
    fuelCost: {
      type: Number,
      required: true
    },
    binsCollected: {
      type: Number,
      required: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Route', routeSchema);




