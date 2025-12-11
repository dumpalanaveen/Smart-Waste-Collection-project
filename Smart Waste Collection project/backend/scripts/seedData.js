/**
 * Seed script to populate initial bin data
 * Run with: node backend/scripts/seedData.js
 */

const mongoose = require('mongoose');
const Bin = require('../models/Bin');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/waste-optimizer';

// Sample bin data (NYC area coordinates)
const sampleBins = [
    { binId: 'BIN001', location: { latitude: 40.7128, longitude: -74.0060 }, fillLevel: 45, priority: 'medium' },
    { binId: 'BIN002', location: { latitude: 40.7589, longitude: -73.9851 }, fillLevel: 78, priority: 'high' },
    { binId: 'BIN003', location: { latitude: 40.7489, longitude: -73.9680 }, fillLevel: 32, priority: 'low' },
    { binId: 'BIN004', location: { latitude: 40.7282, longitude: -73.9942 }, fillLevel: 92, priority: 'high' },
    { binId: 'BIN005', location: { latitude: 40.7614, longitude: -73.9776 }, fillLevel: 15, priority: 'low' },
    { binId: 'BIN006', location: { latitude: 40.7505, longitude: -73.9934 }, fillLevel: 67, priority: 'medium' },
    { binId: 'BIN007', location: { latitude: 40.6892, longitude: -74.0445 }, fillLevel: 55, priority: 'medium' },
    { binId: 'BIN008', location: { latitude: 40.7061, longitude: -74.0087 }, fillLevel: 83, priority: 'high' },
    { binId: 'BIN009', location: { latitude: 40.6782, longitude: -73.9442 }, fillLevel: 28, priority: 'low' },
    { binId: 'BIN010', location: { latitude: 40.7282, longitude: -73.9792 }, fillLevel: 71, priority: 'medium' },
    { binId: 'BIN011', location: { latitude: 40.7580, longitude: -73.9855 }, fillLevel: 40, priority: 'low' },
    { binId: 'BIN012', location: { latitude: 40.7505, longitude: -73.9934 }, fillLevel: 89, priority: 'high' },
    { binId: 'BIN013', location: { latitude: 40.6892, longitude: -74.0445 }, fillLevel: 23, priority: 'low' },
    { binId: 'BIN014', location: { latitude: 40.7061, longitude: -74.0087 }, fillLevel: 65, priority: 'medium' },
    { binId: 'BIN015', location: { latitude: 40.6782, longitude: -73.9442 }, fillLevel: 52, priority: 'medium' }
];

async function seedData() {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');

        // Clear existing bins
        await Bin.deleteMany({});
        console.log('Cleared existing bins');

        // Insert sample bins
        for (const binData of sampleBins) {
            const bin = new Bin(binData);
            await bin.save();
        }

        console.log(`Successfully seeded ${sampleBins.length} bins`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seedData();

