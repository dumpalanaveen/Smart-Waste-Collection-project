const Comparison = require('../models/Comparison');
const Bin = require('../models/Bin');
const AStarOptimizer = require('../algorithms/astar');
const GeneticOptimizer = require('../algorithms/genetic');

/**
 * Get all comparison results
 */
exports.getAllComparisons = async (req, res) => {
  try {
    const comparisons = await Comparison.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: comparisons });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Run a new comparison test
 */
exports.runComparison = async (req, res) => {
  try {
    const { testCase, depot } = req.body;

    const bins = await Bin.find();
    const binsToCollect = bins.filter(bin => bin.fillLevel > 30);

    if (binsToCollect.length === 0) {
      return res.status(400).json({ success: false, error: 'No bins need collection' });
    }

    const depotLocation = depot || {
      latitude: bins[0].location.latitude,
      longitude: bins[0].location.longitude
    };

    // Run A* algorithm
    const astarOptimizer = new AStarOptimizer(binsToCollect, { location: depotLocation });
    const astarResult = astarOptimizer.optimize();

    // Run Genetic Algorithm
    const geneticOptimizer = new GeneticOptimizer(binsToCollect, { location: depotLocation });
    const geneticResult = geneticOptimizer.optimize();

    // Calculate improvements
    const improvement = {
      distance: parseFloat(((geneticResult.metrics.totalDistance - astarResult.metrics.totalDistance) / astarResult.metrics.totalDistance * 100).toFixed(2)),
      time: parseFloat(((geneticResult.metrics.estimatedTime - astarResult.metrics.estimatedTime) / astarResult.metrics.estimatedTime * 100).toFixed(2)),
      fuelCost: parseFloat(((geneticResult.metrics.fuelCost - astarResult.metrics.fuelCost) / astarResult.metrics.fuelCost * 100).toFixed(2)),
      computationTime: parseFloat(((geneticResult.metrics.computationTime - astarResult.metrics.computationTime) / astarResult.metrics.computationTime * 100).toFixed(2))
    };

    // Save comparison
    const comparison = new Comparison({
      testCase: testCase || `Test_${Date.now()}`,
      astar: astarResult.metrics,
      genetic: geneticResult.metrics,
      improvement
    });

    await comparison.save();

    res.json({
      success: true,
      data: comparison
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};




