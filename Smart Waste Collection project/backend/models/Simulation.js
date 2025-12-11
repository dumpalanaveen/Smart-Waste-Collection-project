const mongoose = require('mongoose');

const simulationSchema = new mongoose.Schema({
  simulationId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['random', 'manual', 'time-based'],
    required: true
  },
  binsUpdated: [{
    binId: String,
    oldFillLevel: Number,
    newFillLevel: Number,
    timestamp: Date
  }],
  routeGenerated: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route'
  },
  duration: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Simulation', simulationSchema);




