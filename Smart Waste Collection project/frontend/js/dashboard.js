// Dashboard functionality
const API_BASE_URL = 'http://localhost:3000/api';

let map;
let bins = [];
let currentRoute = null;
let markers = [];
let routePolyline = null;

// Initialize map
function initMap() {
    map = L.map('map').setView([40.7128, -74.0060], 12); // Default to NYC
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

// Load bins from API
async function loadBins() {
    try {
        const response = await fetch(`${API_BASE_URL}/bins`);
        const data = await response.json();
        
        if (data.success) {
            bins = data.data;
            updateBinSelect();
            displayBinsOnMap();
        } else {
            console.error('Failed to load bins:', data.error);
        }
    } catch (error) {
        console.error('Error loading bins:', error);
        alert('Failed to load bins. Make sure the server is running.');
    }
}

// Update bin select dropdown
function updateBinSelect() {
    const select = document.getElementById('binIdSelect');
    select.innerHTML = '<option value="">Select Bin</option>';
    
    bins.forEach(bin => {
        const option = document.createElement('option');
        option.value = bin.binId;
        option.textContent = `${bin.binId} (${bin.fillLevel}% full)`;
        select.appendChild(option);
    });
}

// Display bins on map
function displayBinsOnMap() {
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    bins.forEach(bin => {
        const fillLevel = bin.fillLevel;
        let color = 'green';
        
        if (fillLevel >= 90) {
            color = 'red';
        } else if (fillLevel >= 70) {
            color = 'orange';
        } else if (fillLevel >= 30) {
            color = 'yellow';
        }

        const marker = L.circleMarker([bin.location.latitude, bin.location.longitude], {
            radius: 8,
            fillColor: color,
            color: '#333',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);

        marker.bindPopup(`
            <strong>Bin ID:</strong> ${bin.binId}<br>
            <strong>Fill Level:</strong> ${fillLevel}%<br>
            <strong>Status:</strong> ${bin.status}<br>
            <strong>Priority:</strong> ${bin.priority}
        `);

        markers.push(marker);
    });

    // Fit map to show all bins
    if (bins.length > 0) {
        const bounds = bins.map(bin => [bin.location.latitude, bin.location.longitude]);
        map.fitBounds(bounds, { padding: [50, 50] });
    }
}

// Display route on map
function displayRoute(route) {
    // Remove existing route
    if (routePolyline) {
        map.removeLayer(routePolyline);
    }

    if (!route || route.length === 0) return;

    // Create route coordinates
    const routeCoords = route.map(bin => [bin.latitude, bin.longitude]);
    
    // Add polyline
    routePolyline = L.polyline(routeCoords, {
        color: '#3498db',
        weight: 4,
        opacity: 0.7
    }).addTo(map);

    // Add route markers with order numbers
    route.forEach((bin, index) => {
        const marker = L.marker([bin.latitude, bin.longitude], {
            icon: L.divIcon({
                className: 'route-marker',
                html: `<div style="background: #3498db; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white;">${index + 1}</div>`,
                iconSize: [30, 30]
            })
        }).addTo(map);

        marker.bindPopup(`
            <strong>Stop ${index + 1}</strong><br>
            <strong>Bin ID:</strong> ${bin.binId}<br>
            <strong>Fill Level:</strong> ${bin.fillLevel}%
        `);

        markers.push(marker);
    });

    // Fit map to show route
    map.fitBounds(routeCoords, { padding: [50, 50] });
}

// Update metrics display
function updateMetrics(metrics) {
    document.getElementById('totalDistance').textContent = metrics.totalDistance || '-';
    document.getElementById('estimatedTime').textContent = metrics.estimatedTime || '-';
    document.getElementById('fuelCost').textContent = metrics.fuelCost || '-';
    document.getElementById('binsCollected').textContent = metrics.binsCollected || '-';
}

// Optimize route
async function optimizeRoute() {
    const algorithm = document.getElementById('algorithmSelect').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/optimize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ algorithm })
        });

        const data = await response.json();
        
        if (data.success) {
            currentRoute = data.data.route;
            updateMetrics(data.data.metrics);
            displayRoute(currentRoute);
            alert('Route optimized successfully!');
        } else {
            alert('Failed to optimize route: ' + data.error);
        }
    } catch (error) {
        console.error('Error optimizing route:', error);
        alert('Failed to optimize route. Make sure the server is running.');
    }
}

// Update bin fill level
async function updateBin() {
    const binId = document.getElementById('binIdSelect').value;
    const fillLevel = parseFloat(document.getElementById('fillLevelInput').value);

    if (!binId) {
        alert('Please select a bin');
        return;
    }

    if (fillLevel < 0 || fillLevel > 100) {
        alert('Fill level must be between 0 and 100');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/bins/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ binId, fillLevel })
        });

        const data = await response.json();
        
        if (data.success) {
            alert('Bin updated successfully!');
            loadBins();
            if (currentRoute) {
                optimizeRoute();
            }
        } else {
            alert('Failed to update bin: ' + data.error);
        }
    } catch (error) {
        console.error('Error updating bin:', error);
        alert('Failed to update bin. Make sure the server is running.');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    loadBins();

    document.getElementById('optimizeBtn').addEventListener('click', optimizeRoute);
    document.getElementById('recalculateBtn').addEventListener('click', optimizeRoute);
    document.getElementById('refreshBinsBtn').addEventListener('click', loadBins);
    document.getElementById('updateBinBtn').addEventListener('click', updateBin);
});



