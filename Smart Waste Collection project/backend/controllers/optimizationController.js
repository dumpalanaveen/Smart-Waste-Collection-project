const Bin = require('../models/Bin');
const Route = require('../models/Route');
const AStarOptimizer = require('../algorithms/astar');
const GeneticOptimizer = require('../algorithms/genetic');

/**
 * Optimize route using specified algorithm
 */
exports.optimizeRoute = async (req, res) => {
  try {
    const { algorithm, depot } = req.body;

    if (!algorithm || !['astar', 'genetic'].includes(algorithm)) {
      return res.status(400).json({ success: false, error: 'Invalid algorithm. Use "astar" or "genetic"' });
    }

    // Get all bins
    const bins = await Bin.find();
    
    if (bins.length === 0) {
      return res.status(400).json({ success: false, error: 'No bins available for optimization' });
    }

    // Default depot location (can be customized)
    const depotLocation = depot || {
      latitude: bins[0].location.latitude,
      longitude: bins[0].location.longitude
    };

    // Filter bins that need collection (fill level > 30%)
    const binsToCollect = bins.filter(bin => bin.fillLevel > 30);

    if (binsToCollect.length === 0) {
      return res.status(400).json({ success: false, error: 'No bins need collection (all below 30% fill level)' });
    }

    let result;

    // Run optimization algorithm
    if (algorithm === 'astar') {
      const optimizer = new AStarOptimizer(binsToCollect, { location: depotLocation });
      result = optimizer.optimize();
    } else if (algorithm === 'genetic') {
      const optimizer = new GeneticOptimizer(binsToCollect, { location: depotLocation });
      result = optimizer.optimize();
    }

    // Save route to database
    const route = new Route({
      algorithm,
      bins: result.route,
      metrics: result.metrics
    });

    await route.save();

    res.json({
      success: true,
      data: {
        route: result.route,
        metrics: result.metrics,
        routeId: route._id
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Compare both algorithms
 */
exports.compareAlgorithms = async (req, res) => {
  try {
    const { depot } = req.body;

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

    res.json({
      success: true,
      data: {
        astar: astarResult.metrics,
        genetic: geneticResult.metrics,
        improvement,
        astarRoute: astarResult.route,
        geneticRoute: geneticResult.route
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};




