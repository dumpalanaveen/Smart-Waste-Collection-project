const Simulation = require('../models/Simulation');
const Bin = require('../models/Bin');
const Route = require('../models/Route');
const AStarOptimizer = require('../algorithms/astar');
const GeneticOptimizer = require('../algorithms/genetic');

/**
 * Run random fill level simulation
 */
exports.randomSimulation = async (req, res) => {
  try {
    const { algorithm } = req.body;

    const bins = await Bin.find();
    const updates = [];
    const timestamp = new Date();

    // Generate random fill levels
    bins.forEach(bin => {
      const newFillLevel = Math.floor(Math.random() * 100);
      updates.push({
        binId: bin.binId,
        oldFillLevel: bin.fillLevel,
        newFillLevel,
        timestamp
      });
      bin.fillLevel = newFillLevel;
      bin.lastCollected = timestamp;
      bin.save();
    });

    // Create simulation record
    const simulation = new Simulation({
      simulationId: `SIM_${Date.now()}`,
      type: 'random',
      binsUpdated: updates
    });

    // Generate route if algorithm specified
    if (algorithm) {
      const binsToCollect = bins.filter(bin => bin.fillLevel > 30);
      if (binsToCollect.length > 0) {
        const depotLocation = {
          latitude: bins[0].location.latitude,
          longitude: bins[0].location.longitude
        };

        let result;
        if (algorithm === 'astar') {
          const optimizer = new AStarOptimizer(binsToCollect, { location: depotLocation });
          result = optimizer.optimize();
        } else {
          const optimizer = new GeneticOptimizer(binsToCollect, { location: depotLocation });
          result = optimizer.optimize();
        }

        const route = new Route({
          algorithm,
          bins: result.route,
          metrics: result.metrics
        });
        await route.save();
        simulation.routeGenerated = route._id;
      }
    }

    await simulation.save();

    res.json({
      success: true,
      data: {
        simulation,
        bins: await Bin.find()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Run manual update simulation
 */
exports.manualSimulation = async (req, res) => {
  try {
    const { updates, algorithm } = req.body;

    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({ success: false, error: 'Updates array is required' });
    }

    const simulationUpdates = [];
    const timestamp = new Date();

    for (const update of updates) {
      const bin = await Bin.findOne({ binId: update.binId });
      if (bin) {
        simulationUpdates.push({
          binId: bin.binId,
          oldFillLevel: bin.fillLevel,
          newFillLevel: update.fillLevel,
          timestamp
        });
        bin.fillLevel = update.fillLevel;
        bin.lastCollected = timestamp;
        await bin.save();
      }
    }

    const simulation = new Simulation({
      simulationId: `SIM_${Date.now()}`,
      type: 'manual',
      binsUpdated: simulationUpdates
    });

    // Generate route if algorithm specified
    if (algorithm) {
      const bins = await Bin.find();
      const binsToCollect = bins.filter(bin => bin.fillLevel > 30);
      if (binsToCollect.length > 0) {
        const depotLocation = {
          latitude: bins[0].location.latitude,
          longitude: bins[0].location.longitude
        };

        let result;
        if (algorithm === 'astar') {
          const optimizer = new AStarOptimizer(binsToCollect, { location: depotLocation });
          result = optimizer.optimize();
        } else {
          const optimizer = new GeneticOptimizer(binsToCollect, { location: depotLocation });
          result = optimizer.optimize();
        }

        const route = new Route({
          algorithm,
          bins: result.route,
          metrics: result.metrics
        });
        await route.save();
        simulation.routeGenerated = route._id;
      }
    }

    await simulation.save();

    res.json({
      success: true,
      data: {
        simulation,
        bins: await Bin.find()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Run time-based simulation
 */
exports.timeBasedSimulation = async (req, res) => {
  try {
    const { duration, interval, algorithm } = req.body;
    // duration in minutes, interval in minutes

    const bins = await Bin.find();
    const startTime = Date.now();
    const endTime = startTime + (duration * 60 * 1000);
    const intervalMs = interval * 60 * 1000;

    const allUpdates = [];
    let currentTime = startTime;

    while (currentTime < endTime) {
      const updates = [];
      bins.forEach(bin => {
        // Simulate gradual fill increase
        const increase = Math.random() * 5; // 0-5% increase per interval
        const newFillLevel = Math.min(100, bin.fillLevel + increase);
        updates.push({
          binId: bin.binId,
          oldFillLevel: bin.fillLevel,
          newFillLevel: parseFloat(newFillLevel.toFixed(2)),
          timestamp: new Date(currentTime)
        });
        bin.fillLevel = newFillLevel;
      });

      // Save updates
      for (const update of updates) {
        const bin = await Bin.findOne({ binId: update.binId });
        if (bin) {
          bin.fillLevel = update.newFillLevel;
          await bin.save();
        }
      }

      allUpdates.push(...updates);
      currentTime += intervalMs;
    }

    const simulation = new Simulation({
      simulationId: `SIM_${Date.now()}`,
      type: 'time-based',
      binsUpdated: allUpdates,
      duration: duration
    });

    // Generate final route
    if (algorithm) {
      const binsToCollect = bins.filter(bin => bin.fillLevel > 30);
      if (binsToCollect.length > 0) {
        const depotLocation = {
          latitude: bins[0].location.latitude,
          longitude: bins[0].location.longitude
        };

        let result;
        if (algorithm === 'astar') {
          const optimizer = new AStarOptimizer(binsToCollect, { location: depotLocation });
          result = optimizer.optimize();
        } else {
          const optimizer = new GeneticOptimizer(binsToCollect, { location: depotLocation });
          result = optimizer.optimize();
        }

        const route = new Route({
          algorithm,
          bins: result.route,
          metrics: result.metrics
        });
        await route.save();
        simulation.routeGenerated = route._id;
      }
    }

    await simulation.save();

    res.json({
      success: true,
      data: {
        simulation,
        bins: await Bin.find()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get all simulations
 */
exports.getAllSimulations = async (req, res) => {
  try {
    const simulations = await Simulation.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: simulations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};




