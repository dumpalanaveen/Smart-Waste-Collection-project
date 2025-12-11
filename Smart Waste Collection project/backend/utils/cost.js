const { calculateRouteDistance } = require('./distance');

/**
 * Calculate fuel cost for a route
 * @param {number} distance - Distance in kilometers
 * @param {number} fuelPricePerLiter - Fuel price per liter (default: $1.2)
 * @param {number} fuelEfficiency - Kilometers per liter (default: 8)
 * @returns {number} Total fuel cost
 */
function calculateFuelCost(distance, fuelPricePerLiter = 1.2, fuelEfficiency = 8) {
  const litersUsed = distance / fuelEfficiency;
  return litersUsed * fuelPricePerLiter;
}

/**
 * Calculate estimated time for a route
 * @param {number} distance - Distance in kilometers
 * @param {number} averageSpeed - Average speed in km/h (default: 40)
 * @param {number} binsCount - Number of bins to collect
 * @param {number} timePerBin - Time per bin in minutes (default: 5)
 * @returns {number} Total time in minutes
 */
function calculateEstimatedTime(distance, averageSpeed = 40, binsCount = 0, timePerBin = 5) {
  const travelTime = (distance / averageSpeed) * 60; // Convert to minutes
  const collectionTime = binsCount * timePerBin;
  return travelTime + collectionTime;
}

/**
 * Calculate total cost for a route
 * @param {Array} bins - Array of bins in the route
 * @param {Object} options - Calculation options
 * @returns {Object} Cost metrics
 */
function calculateRouteCosts(bins, options = {}) {
  const distance = calculateRouteDistance(bins);
  const fuelCost = calculateFuelCost(
    distance,
    options.fuelPricePerLiter,
    options.fuelEfficiency
  );
  const estimatedTime = calculateEstimatedTime(
    distance,
    options.averageSpeed,
    bins.length,
    options.timePerBin
  );
  
  return {
    distance: parseFloat(distance.toFixed(2)),
    fuelCost: parseFloat(fuelCost.toFixed(2)),
    estimatedTime: parseFloat(estimatedTime.toFixed(2))
  };
}

module.exports = {
  calculateFuelCost,
  calculateEstimatedTime,
  calculateRouteCosts
};




