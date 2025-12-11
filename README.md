# Smart Waste Collection Route Optimizer

A complete, production-ready web application for optimizing waste collection routes using advanced algorithms (A* Search and Genetic Algorithm). The system provides real-time bin monitoring, route optimization, performance comparison, and simulation capabilities.

## Features

- **Route Optimization**: Two algorithms (A* Search and Genetic Algorithm) for finding optimal collection routes
- **Real-time Monitoring**: Track bin fill levels with color-coded visualizations
- **Interactive Maps**: Visualize bins and optimized routes using Leaflet.js
- **Performance Comparison**: Compare algorithm performance with detailed metrics and Chart.js visualizations
- **Simulation Engine**: Test scenarios with random, manual, and time-based simulation modes
- **Cost Analysis**: Calculate fuel costs, travel time, and operational expenses
- **Responsive Design**: Modern, clean UI that works on all devices

## Technology Stack

### Frontend
- HTML5 & CSS3
- JavaScript (ES6+)
- Leaflet.js for map visualization
- Chart.js for data visualization

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- RESTful API architecture

### Algorithms
- A* Search Algorithm
- Genetic Algorithm
- Haversine distance calculation

## Project Structure

```
Smart Waste Collection project/
├── backend/
│   ├── algorithms/
│   │   ├── astar.js          # A* Search algorithm implementation
│   │   └── genetic.js        # Genetic Algorithm implementation
│   ├── controllers/
│   │   ├── binController.js
│   │   ├── optimizationController.js
│   │   ├── comparisonController.js
│   │   └── simulationController.js
│   ├── models/
│   │   ├── Bin.js
│   │   ├── Route.js
│   │   ├── Comparison.js
│   │   └── Simulation.js
│   ├── routes/
│   │   ├── binRoutes.js
│   │   ├── optimizationRoutes.js
│   │   ├── comparisonRoutes.js
│   │   └── simulationRoutes.js
│   ├── utils/
│   │   ├── distance.js       # Distance calculation utilities
│   │   └── cost.js           # Cost calculation utilities
│   └── scripts/
│       └── seedData.js       # Database seeding script
├── frontend/
│   ├── css/
│   │   └── styles.css        # Main stylesheet
│   ├── js/
│   │   ├── navbar.js         # Navigation functionality
│   │   ├── dashboard.js      # Dashboard functionality
│   │   ├── comparison.js    # Comparison page functionality
│   │   ├── dataset.js       # Dataset & simulation functionality
│   │   └── contact.js       # Contact form functionality
│   ├── index.html           # Home page
│   ├── how-it-works.html    # How It Works page
│   ├── comparison.html      # Models & Comparison page
│   ├── dashboard.html       # Route Optimizer Dashboard
│   ├── dataset.html        # Dataset & Simulation page
│   ├── about.html          # About page
│   └── contact.html        # Contact page
├── server.js               # Express server
├── package.json           # Dependencies
└── README.md             # This file
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Steps

1. **Clone or navigate to the project directory**
   ```bash
   cd "Smart Waste Collection project"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Create a `.env` file in the root directory (or copy from `.env.example`)
   - Configure MongoDB connection:
     ```
     PORT=3000
     MONGODB_URI=mongodb://localhost:27017/waste-optimizer
     ```

4. **Start MongoDB**
   - Make sure MongoDB is running on your system
   - For local MongoDB: `mongod` (or start MongoDB service)
   - For MongoDB Atlas: Update `MONGODB_URI` in `.env` with your connection string

5. **Seed initial data (optional)**
   ```bash
   node backend/scripts/seedData.js
   ```
   This will create 15 sample bins with various fill levels in the NYC area.

6. **Start the server**
   ```bash
   npm start
   ```
   The server will start on `http://localhost:3000`

7. **Open the application**
   - Open `frontend/index.html` in your web browser
   - Or navigate to `http://localhost:3000` if serving through Express

## Usage

### Dashboard
1. Navigate to the **Dashboard** page
2. View all bins on the interactive map (color-coded by fill level)
3. Select an optimization algorithm (A* or Genetic)
4. Click **Optimize Route** to generate an optimized collection route
5. View metrics: total distance, estimated time, fuel cost, and bins to collect
6. Update bin fill levels using the update form

### Algorithm Comparison
1. Navigate to the **Models & Comparison** page
2. Click **Run New Comparison** to compare both algorithms
3. View side-by-side metrics and Chart.js visualizations
4. Review historical comparison data in the table

### Dataset & Simulation
1. Navigate to the **Dataset & Simulation** page
2. View all bins in the data table
3. Run simulations:
   - **Random Simulation**: Generate random fill levels for all bins
   - **Manual Update**: Manually update specific bins
   - **Time-based Simulation**: Simulate gradual fill increases over time

## API Endpoints

### Bins
- `GET /api/bins` - Get all bins
- `GET /api/bins/:id` - Get bin by ID
- `POST /api/bins/update` - Update bin fill level
- `POST /api/bins/update-multiple` - Update multiple bins
- `POST /api/bins/create` - Create new bin

### Optimization
- `POST /api/optimize` - Optimize route with specified algorithm
  ```json
  {
    "algorithm": "astar" | "genetic",
    "depot": { "latitude": 40.7128, "longitude": -74.0060 }
  }
  ```
- `POST /api/optimize/compare` - Compare both algorithms

### Comparison
- `GET /api/comparison` - Get all comparison results
- `POST /api/comparison` - Run new comparison test

### Simulation
- `GET /api/simulate` - Get all simulations
- `POST /api/simulate/random` - Run random simulation
- `POST /api/simulate/manual` - Run manual update simulation
- `POST /api/simulate/time-based` - Run time-based simulation

## Algorithm Details

### A* Search Algorithm
- **Type**: Informed search algorithm
- **Best For**: Small to medium-sized networks (up to 50 bins)
- **Advantages**: Fast computation, guaranteed optimal solution for small datasets
- **Time Complexity**: O(b^d) where b is branching factor, d is depth

### Genetic Algorithm
- **Type**: Evolutionary algorithm
- **Best For**: Large networks (50+ bins) and complex scenarios
- **Advantages**: Handles large datasets, finds near-optimal solutions, robust to local optima
- **Parameters**: Population size (50), Generations (100), Mutation rate (0.1), Crossover rate (0.8)

## Metrics

The system calculates and displays:
- **Total Distance**: Sum of all route segments in kilometers (Haversine formula)
- **Estimated Time**: Total collection time including travel and bin emptying
- **Fuel Cost**: Estimated fuel cost based on distance and fuel efficiency
- **Computation Time**: Time taken by algorithm to generate the route
- **Bins Collected**: Number of bins in the optimized route

## Color Coding

Bins are color-coded on the map based on fill level:
- **Green**: 0-29% (Empty)
- **Yellow**: 30-69% (Partial)
- **Orange**: 70-89% (Full)
- **Red**: 90-100% (Overflow)

## Development

### Running in Development Mode
```bash
npm run dev
```
(Requires nodemon: `npm install -g nodemon`)

### Adding New Bins
You can add bins programmatically or through the API:
```javascript
POST /api/bins/create
{
  "binId": "BIN016",
  "location": { "latitude": 40.7128, "longitude": -74.0060 },
  "fillLevel": 50,
  "capacity": 100,
  "priority": "medium"
}
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or check MongoDB service
- Verify connection string in `.env` file
- For MongoDB Atlas, check network access and credentials

### CORS Issues
- The server includes CORS middleware
- If issues persist, check browser console for specific errors

### Map Not Loading
- Ensure Leaflet.js CDN is accessible
- Check browser console for JavaScript errors
- Verify internet connection (Leaflet uses CDN)

### API Errors
- Ensure server is running on port 3000
- Check MongoDB connection
- Verify API endpoint URLs in JavaScript files

## License

MIT License - feel free to use this project for learning and development purposes.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.



