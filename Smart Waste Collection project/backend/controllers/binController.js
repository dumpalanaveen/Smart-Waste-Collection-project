const Bin = require('../models/Bin');

/**
 * Get all bins
 */
exports.getAllBins = async (req, res) => {
  try {
    const bins = await Bin.find().sort({ createdAt: -1 });
    res.json({ success: true, data: bins });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get a single bin by ID
 */
exports.getBinById = async (req, res) => {
  try {
    const bin = await Bin.findOne({ binId: req.params.id });
    if (!bin) {
      return res.status(404).json({ success: false, error: 'Bin not found' });
    }
    res.json({ success: true, data: bin });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Update bin fill level
 */
exports.updateBin = async (req, res) => {
  try {
    const { binId, fillLevel } = req.body;

    if (fillLevel < 0 || fillLevel > 100) {
      return res.status(400).json({ success: false, error: 'Fill level must be between 0 and 100' });
    }

    const bin = await Bin.findOneAndUpdate(
      { binId },
      { fillLevel, lastCollected: new Date() },
      { new: true, runValidators: true }
    );

    if (!bin) {
      return res.status(404).json({ success: false, error: 'Bin not found' });
    }

    res.json({ success: true, data: bin });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Update multiple bins
 */
exports.updateMultipleBins = async (req, res) => {
  try {
    const { updates } = req.body; // Array of { binId, fillLevel }

    const updatePromises = updates.map(async ({ binId, fillLevel }) => {
      if (fillLevel < 0 || fillLevel > 100) {
        throw new Error(`Invalid fill level for bin ${binId}`);
      }

      return Bin.findOneAndUpdate(
        { binId },
        { fillLevel, lastCollected: new Date() },
        { new: true, runValidators: true }
      );
    });

    const updatedBins = await Promise.all(updatePromises);
    res.json({ success: true, data: updatedBins });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Create a new bin
 */
exports.createBin = async (req, res) => {
  try {
    const { binId, location, fillLevel, capacity, priority } = req.body;

    const bin = new Bin({
      binId,
      location,
      fillLevel: fillLevel || 0,
      capacity: capacity || 100,
      priority: priority || 'medium'
    });

    await bin.save();
    res.status(201).json({ success: true, data: bin });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};




