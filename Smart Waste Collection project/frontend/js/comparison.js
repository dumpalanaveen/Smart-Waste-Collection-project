// Comparison page functionality
const API_BASE_URL = 'http://localhost:3000/api';

let charts = {};

// Run comparison
async function runComparison() {
    try {
        const response = await fetch(`${API_BASE_URL}/comparison`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                testCase: `Test_${Date.now()}`
            })
        });

        const data = await response.json();
        
        if (data.success) {
            displayComparisonResults(data.data);
            loadComparisonHistory();
        } else {
            alert('Failed to run comparison: ' + data.error);
        }
    } catch (error) {
        console.error('Error running comparison:', error);
        alert('Failed to run comparison. Make sure the server is running.');
    }
}

// Display comparison results
function displayComparisonResults(data) {
    // Show results section
    document.getElementById('comparisonResults').style.display = 'block';

    // Update A* metrics
    document.getElementById('astar-distance').textContent = data.astar.distance.toFixed(2);
    document.getElementById('astar-time').textContent = data.astar.estimatedTime.toFixed(2);
    document.getElementById('astar-cost').textContent = data.astar.fuelCost.toFixed(2);
    document.getElementById('astar-computation').textContent = data.astar.computationTime;

    // Update Genetic Algorithm metrics
    document.getElementById('genetic-distance').textContent = data.genetic.distance.toFixed(2);
    document.getElementById('genetic-time').textContent = data.genetic.estimatedTime.toFixed(2);
    document.getElementById('genetic-cost').textContent = data.genetic.fuelCost.toFixed(2);
    document.getElementById('genetic-computation').textContent = data.genetic.computationTime;

    // Update improvement metrics
    document.getElementById('improvement-distance').textContent = data.improvement.distance.toFixed(2);
    document.getElementById('improvement-time').textContent = data.improvement.time.toFixed(2);
    document.getElementById('improvement-cost').textContent = data.improvement.fuelCost.toFixed(2);
    document.getElementById('improvement-computation').textContent = data.improvement.computationTime.toFixed(2);

    // Update charts
    updateCharts(data);
}

// Update charts
function updateCharts(data) {
    // Distance Chart
    if (charts.distance) {
        charts.distance.destroy();
    }
    charts.distance = new Chart(document.getElementById('distanceChart'), {
        type: 'bar',
        data: {
            labels: ['A* Search', 'Genetic Algorithm'],
            datasets: [{
                label: 'Distance (km)',
                data: [data.astar.distance, data.genetic.distance],
                backgroundColor: ['#3498db', '#e74c3c']
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Time Chart
    if (charts.time) {
        charts.time.destroy();
    }
    charts.time = new Chart(document.getElementById('timeChart'), {
        type: 'bar',
        data: {
            labels: ['A* Search', 'Genetic Algorithm'],
            datasets: [{
                label: 'Time (min)',
                data: [data.astar.estimatedTime, data.genetic.estimatedTime],
                backgroundColor: ['#3498db', '#e74c3c']
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Cost Chart
    if (charts.cost) {
        charts.cost.destroy();
    }
    charts.cost = new Chart(document.getElementById('costChart'), {
        type: 'bar',
        data: {
            labels: ['A* Search', 'Genetic Algorithm'],
            datasets: [{
                label: 'Fuel Cost ($)',
                data: [data.astar.fuelCost, data.genetic.fuelCost],
                backgroundColor: ['#3498db', '#e74c3c']
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Computation Time Chart
    if (charts.computation) {
        charts.computation.destroy();
    }
    charts.computation = new Chart(document.getElementById('computationChart'), {
        type: 'bar',
        data: {
            labels: ['A* Search', 'Genetic Algorithm'],
            datasets: [{
                label: 'Computation Time (ms)',
                data: [data.astar.computationTime, data.genetic.computationTime],
                backgroundColor: ['#3498db', '#e74c3c']
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Load comparison history
async function loadComparisonHistory() {
    try {
        const response = await fetch(`${API_BASE_URL}/comparison`);
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
            displayComparisonTable(data.data);
        }
    } catch (error) {
        console.error('Error loading comparison history:', error);
    }
}

// Display comparison table
function displayComparisonTable(comparisons) {
    const tbody = document.getElementById('comparisonTableBody');
    tbody.innerHTML = '';

    comparisons.forEach(comp => {
        // A* row
        const astarRow = document.createElement('tr');
        astarRow.innerHTML = `
            <td>${comp.testCase}</td>
            <td>A* Search</td>
            <td>${comp.astar.distance.toFixed(2)}</td>
            <td>${comp.astar.time.toFixed(2)}</td>
            <td>${comp.astar.fuelCost.toFixed(2)}</td>
            <td>${comp.astar.computationTime}</td>
            <td>${new Date(comp.createdAt).toLocaleDateString()}</td>
        `;
        tbody.appendChild(astarRow);

        // Genetic Algorithm row
        const geneticRow = document.createElement('tr');
        geneticRow.innerHTML = `
            <td>${comp.testCase}</td>
            <td>Genetic Algorithm</td>
            <td>${comp.genetic.distance.toFixed(2)}</td>
            <td>${comp.genetic.time.toFixed(2)}</td>
            <td>${comp.genetic.fuelCost.toFixed(2)}</td>
            <td>${comp.genetic.computationTime}</td>
            <td>${new Date(comp.createdAt).toLocaleDateString()}</td>
        `;
        tbody.appendChild(geneticRow);
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('runComparison').addEventListener('click', runComparison);
    document.getElementById('loadHistory').addEventListener('click', loadComparisonHistory);
    
    // Load history on page load
    loadComparisonHistory();
});



