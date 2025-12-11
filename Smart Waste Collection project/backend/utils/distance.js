/**
 * Calculate Haversine distance between two coordinates
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate total distance for a route
 * @param {Array} bins - Array of bins with location data
 * @returns {number} Total distance in kilometers
 */
function calculateRouteDistance(bins) {
  if (bins.length < 2) return 0;
  
  let totalDistance = 0;
  for (let i = 0; i < bins.length - 1; i++) {
    const current = bins[i];
    const next = bins[i + 1];
    totalDistance += haversineDistance(
      current.location.latitude,
      current.location.longitude,
      next.location.latitude,
      next.location.longitude
    );
  }
  
  return totalDistance;
}

module.exports = {
  haversineDistance,
  calculateRouteDistance
};




