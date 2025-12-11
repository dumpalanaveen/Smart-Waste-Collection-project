// Route Visualization Map
document.addEventListener('DOMContentLoaded', function() {
    // Initialize map
    const map = L.map('route-map').setView([40.7128, -74.0060], 12); // New York City center

    // Add OpenStreetMap tiles (free)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
    }).addTo(map);

    // Sample waste collection points with GPS coordinates
    const wastePoints = [
        {
            id: 1,
            lat: 40.7589,
            lng: -73.9851,
            address: "Times Square, Manhattan",
            wasteType: "Mixed Waste",
            collectionTime: "08:00 AM",
            fillLevel: "85%",
            status: "High Priority"
        },
        {
            id: 2,
            lat: 40.7505,
            lng: -73.9934,
            address: "Bryant Park, Manhattan",
            wasteType: "Recyclables",
            collectionTime: "09:15 AM",
            fillLevel: "65%",
            status: "Medium Priority"
        },
        {
            id: 3,
            lat: 40.7614,
            lng: -73.9776,
            address: "Central Park South, Manhattan",
            wasteType: "Organic Waste",
            collectionTime: "10:30 AM",
            fillLevel: "45%",
            status: "Low Priority"
        },
        {
            id: 4,
            lat: 40.7484,
            lng: -73.9857,
            address: "Empire State Building, Manhattan",
            wasteType: "Mixed Waste",
            collectionTime: "11:45 AM",
            fillLevel: "90%",
            status: "High Priority"
        },
        {
            id: 5,
            lat: 40.7505,
            lng: -73.9934,
            address: "Bryant Park (Return), Manhattan",
            wasteType: "Recyclables",
            collectionTime: "01:00 PM",
            fillLevel: "70%",
            status: "Medium Priority"
        }
    ];

    // Create markers for each point
    const markers = [];
    const waypoints = [];

    wastePoints.forEach(point => {
        waypoints.push([point.lat, point.lng]);

        // Create custom icon based on waste type
        let iconColor;
        switch(point.wasteType) {
            case 'Mixed Waste':
                iconColor = '#2d8659';
                break;
            case 'Recyclables':
                iconColor = '#2196f3';
                break;
            case 'Organic Waste':
                iconColor = '#ff9800';
                break;
            default:
                iconColor = '#666';
        }

        const customIcon = L.divIcon({
            html: `<div style="background-color: ${iconColor}; border: 3px solid white; border-radius: 50%; width: 20px; height: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
            className: 'custom-waste-marker',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        const marker = L.marker([point.lat, point.lng], { icon: customIcon }).addTo(map);

        // Create tooltip content
        const tooltipContent = `
            <div style="font-family: 'Inter', sans-serif; min-width: 200px;">
                <strong>${point.address}</strong><br>
                <span style="color: #666;">Waste Type:</span> ${point.wasteType}<br>
                <span style="color: #666;">Collection Time:</span> ${point.collectionTime}<br>
                <span style="color: #666;">Fill Level:</span> ${point.fillLevel}<br>
                <span style="color: #666;">Priority:</span> ${point.status}
            </div>
        `;

        marker.bindTooltip(tooltipContent, {
            permanent: false,
            direction: 'top',
            offset: [0, -10]
        });

        markers.push(marker);
    });

    // Draw optimized route (simplified as straight lines between points)
    const routeCoordinates = [
        [40.7589, -73.9851], // Times Square
        [40.7505, -73.9934], // Bryant Park
        [40.7614, -73.9776], // Central Park South
        [40.7484, -73.9857], // Empire State Building
        [40.7505, -73.9934]  // Back to Bryant Park
    ];

    // Create route polyline with custom styling
    const routeLine = L.polyline(routeCoordinates, {
        color: '#2d8659',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 10',
        lineJoin: 'round'
    }).addTo(map);

    // Add route animation effect
    function animateRoute() {
        let dashOffset = 0;
        const animation = setInterval(() => {
            dashOffset += 1;
            routeLine.setStyle({
                dashOffset: dashOffset
            });
        }, 50);

        // Stop animation after some time
        setTimeout(() => {
            clearInterval(animation);
        }, 3000);
    }

    // Start animation on page load
    setTimeout(animateRoute, 1000);

    // Populate route summary box
    document.getElementById('total-points').textContent = wastePoints.length;
    document.getElementById('estimated-distance').textContent = '3.2 km';
    document.getElementById('estimated-time').textContent = '45 min';
    document.getElementById('algorithm-used').textContent = 'A* Search';

    // Fit map to show all points
    const bounds = L.latLngBounds(waypoints);
    map.fitBounds(bounds, { padding: [20, 20] });

    // Add zoom controls
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    // Add scale control
    L.control.scale({
        position: 'bottomleft',
        imperial: false
    }).addTo(map);
});
