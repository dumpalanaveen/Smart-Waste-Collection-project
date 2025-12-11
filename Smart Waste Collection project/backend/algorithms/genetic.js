const { haversineDistance, calculateRouteDistance } = require('../utils/distance');

/**
 * Genetic Algorithm for Route Optimization
 * Uses evolutionary approach to find near-optimal routes
 */
class GeneticOptimizer {
  constructor(bins, depot, options = {}) {
    this.bins = bins;
    this.depot = depot;
    this.populationSize = options.populationSize || 50;
    this.generations = options.generations || 100;
    this.mutationRate = options.mutationRate || 0.1;
    this.crossoverRate = options.crossoverRate || 0.8;
    this.startTime = Date.now();
  }

  /**
   * Calculate fitness of a route (lower distance = higher fitness)
   */
  calculateFitness(route) {
    if (route.length === 0) return Infinity;

    let totalDistance = 0;

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

    // Add penalty for high fill level bins (should be collected earlier)
    let priorityPenalty = 0;
    route.forEach((bin, index) => {
      const priority = bin.priority === 'high' ? 1.5 : bin.priority === 'medium' ? 1.0 : 0.5;
      const fillWeight = bin.fillLevel / 100;
      priorityPenalty += (index / route.length) * (1 - fillWeight * priority) * 0.1;
    });

    return totalDistance + priorityPenalty;
  }

  /**
   * Create initial population
   */
  createInitialPopulation() {
    const population = [];
    
    for (let i = 0; i < this.populationSize; i++) {
      // Create random permutation
      const route = [...this.bins];
      for (let j = route.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [route[j], route[k]] = [route[k], route[j]];
      }
      population.push(route);
    }

    return population;
  }

  /**
   * Tournament selection
   */
  tournamentSelection(population, fitness) {
    const tournamentSize = 5;
    const tournament = [];
    
    for (let i = 0; i < tournamentSize; i++) {
      const randomIndex = Math.floor(Math.random() * population.length);
      tournament.push({ route: population[randomIndex], fitness: fitness[randomIndex] });
    }

    tournament.sort((a, b) => a.fitness - b.fitness);
    return tournament[0].route;
  }

  /**
   * Order crossover (OX)
   */
  crossover(parent1, parent2) {
    if (Math.random() > this.crossoverRate) {
      return Math.random() > 0.5 ? [...parent1] : [...parent2];
    }

    const start = Math.floor(Math.random() * parent1.length);
    const end = Math.floor(Math.random() * (parent1.length - start)) + start;

    const child = new Array(parent1.length).fill(null);
    const segment = parent1.slice(start, end + 1);

    // Copy segment to child
    for (let i = start; i <= end; i++) {
      child[i] = segment[i - start];
    }

    // Fill remaining positions from parent2
    let parentIndex = 0;
    for (let i = 0; i < child.length; i++) {
      if (child[i] === null) {
        while (segment.includes(parent2[parentIndex])) {
          parentIndex++;
        }
        child[i] = parent2[parentIndex];
        parentIndex++;
      }
    }

    return child;
  }

  /**
   * Swap mutation
   */
  mutate(route) {
    if (Math.random() > this.mutationRate) {
      return route;
    }

    const mutated = [...route];
    const i = Math.floor(Math.random() * mutated.length);
    const j = Math.floor(Math.random() * mutated.length);
    [mutated[i], mutated[j]] = [mutated[j], mutated[i]];

    return mutated;
  }

  /**
   * Optimize route using Genetic Algorithm
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

    if (this.bins.length === 1) {
      const route = this.bins[0];
      const distance = haversineDistance(
        this.depot.location.latitude,
        this.depot.location.longitude,
        route.location.latitude,
        route.location.longitude
      ) * 2;

      return {
        route: [{
          binId: route.binId,
          order: 1,
          latitude: route.location.latitude,
          longitude: route.location.longitude,
          fillLevel: route.fillLevel
        }],
        metrics: {
          totalDistance: parseFloat(distance.toFixed(2)),
          estimatedTime: parseFloat(((distance / 40) * 60 + 5).toFixed(2)),
          fuelCost: parseFloat(((distance / 8) * 1.2).toFixed(2)),
          binsCollected: 1,
          computationTime: Date.now() - this.startTime
        }
      };
    }

    // Initialize population
    let population = this.createInitialPopulation();
    let bestRoute = null;
    let bestFitness = Infinity;

    // Evolution loop
    for (let generation = 0; generation < this.generations; generation++) {
      // Calculate fitness for all individuals
      const fitness = population.map(route => this.calculateFitness(route));

      // Track best solution
      for (let i = 0; i < fitness.length; i++) {
        if (fitness[i] < bestFitness) {
          bestFitness = fitness[i];
          bestRoute = [...population[i]];
        }
      }

      // Create new population
      const newPopulation = [];

      // Elitism: keep best solution
      newPopulation.push([...bestRoute]);

      // Generate offspring
      while (newPopulation.length < this.populationSize) {
        const parent1 = this.tournamentSelection(population, fitness);
        const parent2 = this.tournamentSelection(population, fitness);
        let child = this.crossover(parent1, parent2);
        child = this.mutate(child);
        newPopulation.push(child);
      }

      population = newPopulation;
    }

    // Calculate final metrics
    const totalDistance = this.calculateFitness(bestRoute);
    const computationTime = Date.now() - this.startTime;

    return {
      route: bestRoute.map((bin, index) => ({
        binId: bin.binId,
        order: index + 1,
        latitude: bin.location.latitude,
        longitude: bin.location.longitude,
        fillLevel: bin.fillLevel
      })),
      metrics: {
        totalDistance: parseFloat(totalDistance.toFixed(2)),
        estimatedTime: parseFloat(((totalDistance / 40) * 60 + bestRoute.length * 5).toFixed(2)),
        fuelCost: parseFloat(((totalDistance / 8) * 1.2).toFixed(2)),
        binsCollected: bestRoute.length,
        computationTime: computationTime
      }
    };
  }
}

module.exports = GeneticOptimizer;




