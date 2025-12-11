const mongoose = require('mongoose');

const binSchema = new mongoose.Schema({
  binId: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  fillLevel: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0
  },
  capacity: {
    type: Number,
    required: true,
    default: 100
  },
  lastCollected: {
    type: Date,
    default: Date.now
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['empty', 'partial', 'full', 'overflow'],
    default: 'empty'
  }
}, {
  timestamps: true
});

// Update status based on fill level
binSchema.methods.updateStatus = function() {
  if (this.fillLevel >= 90) {
    this.status = 'overflow';
  } else if (this.fillLevel >= 70) {
    this.status = 'full';
  } else if (this.fillLevel >= 30) {
    this.status = 'partial';
  } else {
    this.status = 'empty';
  }
};

binSchema.pre('save', function(next) {
  this.updateStatus();
  next();
});

module.exports = mongoose.model('Bin', binSchema);




