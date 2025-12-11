const { haversineDistance } = require('../utils/distance');

/**
 * A* Search Algorithm for Route Optimization
 * Finds the optimal path visiting all bins starting from a depot
 */
class AStarOptimizer {
  constructor(bins, depot) {
    this.bins = bins;
    this.depot = depot;
    this.startTime = Date.now();
  }

  /**
   * Heuristic function: straight-line distance to goal
   */
  heuristic(node, goal) {
    return haversineDistance(
      node.location.latitude,
      node.location.longitude,
      goal.location.latitude,
      goal.location.longitude
    );
  }

  /**
   * Get priority score for a bin (higher fill level = higher priority)
   */
  getPriority(bin) {
    const fillWeight = bin.fillLevel / 100;
    const priorityWeight = bin.priority === 'high' ? 1.5 : bin.priority === 'medium' ? 1.0 : 0.5;
    return fillWeight * priorityWeight;
  }

  /**
   * Find optimal route using A* algorithm
   */
  optimize() {
    if (this.bins.length === 0) {
      return {
        route: [],
        metrics: {
          totalDistance: 0,
          estimatedTime: 0,
          fuelCost: 0,
          binsCollected: 0,
          computationTime: 0
        }
      };
    }

    // Sort bins by priority (fill level and priority status)
    const sortedBins = [...this.bins].sort((a, b) => {
      const priorityA = this.getPriority(a);
      const priorityB = this.getPriority(b);
      return priorityB - priorityA;
    });

    // Build route using nearest neighbor with A* heuristic
    const route = [];
    let current = this.depot;
    const remaining = [...sortedBins];

    while (remaining.length > 0) {
      let bestBin = null;
      let bestScore = Infinity;

      for (const bin of remaining) {
        const distance = haversineDistance(
          current.location.latitude,
          current.location.longitude,
          bin.location.latitude,
          bin.location.longitude
        );
        
        // A* score: f(n) = g(n) + h(n)
        // g(n) = distance from current to bin
        // h(n) = heuristic (distance to nearest unvisited bin)
        const heuristicValue = remaining.length > 1 
          ? Math.min(...remaining.filter(b => b.binId !== bin.binId).map(b => 
              haversineDistance(
                bin.location.latitude,
                bin.location.longitude,
                b.location.latitude,
                b.location.longitude
              )
            ))
          : haversineDistance(
              bin.location.latitude,
              bin.location.longitude,
              this.depot.location.latitude,
              this.depot.location.longitude
            );
        
        const priority = this.getPriority(bin);
        const score = distance + heuristicValue - (priority * 2); // Lower score is better
        
        if (score < bestScore) {
          bestScore = score;
          bestBin = bin;
        }
      }

      if (bestBin) {
        route.push(bestBin);
        current = bestBin;
        remaining.splice(remaining.indexOf(bestBin), 1);
      }
    }

    // Calculate total distance including return to depot
    let totalDistance = 0;
    if (route.length > 0) {
      // Distance from depot to first bin
      totalDistance += haversineDistance(
        this.depot.location.latitude,
        this.depot.location.longitude,
        route[0].location.latitude,
        route[0].location.longitude
      );

      // Distance between bins
      for (let i = 0; i < route.length - 1; i++) {
        totalDistance += haversineDistance(
          route[i].location.latitude,
          route[i].location.longitude,
          route[i + 1].location.latitude,
          route[i + 1].location.longitude
        );
      }

      // Distance from last bin back to depot
      totalDistance += haversineDistance(
        route[route.length - 1].location.latitude,
        route[route.length - 1].location.longitude,
        this.depot.location.latitude,
        this.depot.location.longitude
      );
    }

    const computationTime = Date.now() - this.startTime;

    return {
      route: route.map((bin, index) => ({
        binId: bin.binId,
        order: index + 1,
        latitude: bin.location.latitude,
        longitude: bin.location.longitude,
        fillLevel: bin.fillLevel
      })),
      metrics: {
        totalDistance: parseFloat(totalDistance.toFixed(2)),
        estimatedTime: parseFloat(((totalDistance / 40) * 60 + route.length * 5).toFixed(2)),
        fuelCost: parseFloat(((totalDistance / 8) * 1.2).toFixed(2)),
        binsCollected: route.length,
        computationTime: computationTime
      }
    };
  }
}

module.exports = AStarOptimizer;




