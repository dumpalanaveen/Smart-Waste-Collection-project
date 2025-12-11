// Dataset and simulation functionality
const API_BASE_URL = 'http://localhost:3000/api';

let allBins = [];

// Tab functionality
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Load bins data
async function loadBinsData() {
    try {
        const response = await fetch(`${API_BASE_URL}/bins`);
        const data = await response.json();
        
        if (data.success) {
            allBins = data.data;
            displayBinsTable(data.data);
            populateBinSelects();
        } else {
            console.error('Failed to load bins:', data.error);
        }
    } catch (error) {
        console.error('Error loading bins:', error);
        alert('Failed to load bins. Make sure the server is running.');
    }
}

// Display bins in table
function displayBinsTable(bins) {
    const tbody = document.getElementById('dataTableBody');
    tbody.innerHTML = '';

    if (bins.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">No bins available</td></tr>';
        return;
    }

    bins.forEach(bin => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${bin.binId}</td>
            <td>${bin.location.latitude.toFixed(6)}</td>
            <td>${bin.location.longitude.toFixed(6)}</td>
            <td>${bin.fillLevel}%</td>
            <td>${bin.capacity}</td>
            <td><span class="status-${bin.status}">${bin.status}</span></td>
            <td>${bin.priority}</td>
            <td>${new Date(bin.lastCollected).toLocaleString()}</td>
        `;
        tbody.appendChild(row);
    });
}

// Populate bin selects
function populateBinSelects() {
    const selects = document.querySelectorAll('.bin-select');
    selects.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Select Bin</option>';
        
        allBins.forEach(bin => {
            const option = document.createElement('option');
            option.value = bin.binId;
            option.textContent = `${bin.binId} (${bin.fillLevel}%)`;
            if (bin.binId === currentValue) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    });
}

// Add manual update item
function addManualUpdateItem() {
    const container = document.getElementById('manualUpdatesContainer');
    const item = document.createElement('div');
    item.className = 'manual-update-item';
    item.innerHTML = `
        <div class="form-group">
            <label>Bin ID:</label>
            <select class="form-control bin-select">
                <option value="">Select Bin</option>
            </select>
        </div>
        <div class="form-group">
            <label>Fill Level (%):</label>
            <input type="number" class="form-control fill-level-input" min="0" max="100" value="0">
        </div>
        <button class="btn btn-danger remove-update-btn">Remove</button>
    `;
    container.appendChild(item);
    populateBinSelects();
    
    // Add remove functionality
    item.querySelector('.remove-update-btn').addEventListener('click', () => {
        item.remove();
    });
}

// Run random simulation
async function runRandomSimulation() {
    const algorithm = document.getElementById('randomAlgorithm').value;
    const resultDiv = document.getElementById('randomSimResult');
    resultDiv.innerHTML = 'Running simulation...';

    try {
        const response = await fetch(`${API_BASE_URL}/simulate/random`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ algorithm })
        });

        const data = await response.json();
        
        if (data.success) {
            resultDiv.innerHTML = `
                <strong>Simulation completed successfully!</strong><br>
                Simulation ID: ${data.data.simulation.simulationId}<br>
                Bins updated: ${data.data.simulation.binsUpdated.length}<br>
                ${data.data.simulation.routeGenerated ? 'Route generated' : 'No route generated'}
            `;
            loadBinsData();
            loadSimulationHistory();
        } else {
            resultDiv.innerHTML = `<strong>Error:</strong> ${data.error}`;
        }
    } catch (error) {
        console.error('Error running random simulation:', error);
        resultDiv.innerHTML = '<strong>Error:</strong> Failed to run simulation. Make sure the server is running.';
    }
}

// Run manual simulation
async function runManualSimulation() {
    const updates = [];
    const updateItems = document.querySelectorAll('.manual-update-item');
    
    updateItems.forEach(item => {
        const binId = item.querySelector('.bin-select').value;
        const fillLevel = parseFloat(item.querySelector('.fill-level-input').value);
        
        if (binId && !isNaN(fillLevel)) {
            updates.push({ binId, fillLevel });
        }
    });

    if (updates.length === 0) {
        alert('Please add at least one bin update');
        return;
    }

    const algorithm = document.getElementById('manualAlgorithm').value;
    const resultDiv = document.getElementById('manualSimResult');
    resultDiv.innerHTML = 'Running simulation...';

    try {
        const response = await fetch(`${API_BASE_URL}/simulate/manual`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ updates, algorithm })
        });

        const data = await response.json();
        
        if (data.success) {
            resultDiv.innerHTML = `
                <strong>Simulation completed successfully!</strong><br>
                Simulation ID: ${data.data.simulation.simulationId}<br>
                Bins updated: ${data.data.simulation.binsUpdated.length}<br>
                ${data.data.simulation.routeGenerated ? 'Route generated' : 'No route generated'}
            `;
            loadBinsData();
            loadSimulationHistory();
        } else {
            resultDiv.innerHTML = `<strong>Error:</strong> ${data.error}`;
        }
    } catch (error) {
        console.error('Error running manual simulation:', error);
        resultDiv.innerHTML = '<strong>Error:</strong> Failed to run simulation. Make sure the server is running.';
    }
}

// Run time-based simulation
async function runTimeBasedSimulation() {
    const duration = parseFloat(document.getElementById('simDuration').value);
    const interval = parseFloat(document.getElementById('simInterval').value);
    const algorithm = document.getElementById('timeAlgorithm').value;

    if (!duration || !interval) {
        alert('Please enter duration and interval');
        return;
    }

    const resultDiv = document.getElementById('timeSimResult');
    resultDiv.innerHTML = 'Running time-based simulation... This may take a while.';

    try {
        const response = await fetch(`${API_BASE_URL}/simulate/time-based`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ duration, interval, algorithm })
        });

        const data = await response.json();
        
        if (data.success) {
            resultDiv.innerHTML = `
                <strong>Simulation completed successfully!</strong><br>
                Simulation ID: ${data.data.simulation.simulationId}<br>
                Duration: ${duration} minutes<br>
                Bins updated: ${data.data.simulation.binsUpdated.length}<br>
                ${data.data.simulation.routeGenerated ? 'Route generated' : 'No route generated'}
            `;
            loadBinsData();
            loadSimulationHistory();
        } else {
            resultDiv.innerHTML = `<strong>Error:</strong> ${data.error}`;
        }
    } catch (error) {
        console.error('Error running time-based simulation:', error);
        resultDiv.innerHTML = '<strong>Error:</strong> Failed to run simulation. Make sure the server is running.';
    }
}

// Load simulation history
async function loadSimulationHistory() {
    try {
        const response = await fetch(`${API_BASE_URL}/simulate`);
        const data = await response.json();
        
        if (data.success) {
            displaySimulationHistory(data.data);
        }
    } catch (error) {
        console.error('Error loading simulation history:', error);
    }
}

// Display simulation history
function displaySimulationHistory(simulations) {
    const tbody = document.getElementById('simulationHistoryBody');
    tbody.innerHTML = '';

    if (simulations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No simulation history available</td></tr>';
        return;
    }

    simulations.forEach(sim => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sim.simulationId}</td>
            <td>${sim.type}</td>
            <td>${sim.binsUpdated.length}</td>
            <td>${sim.duration ? sim.duration + ' min' : '-'}</td>
            <td>${new Date(sim.createdAt).toLocaleString()}</td>
        `;
        tbody.appendChild(row);
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    loadBinsData();
    loadSimulationHistory();

    document.getElementById('refreshTableBtn').addEventListener('click', loadBinsData);
    document.getElementById('addManualUpdateBtn').addEventListener('click', addManualUpdateItem);
    document.getElementById('runRandomSimBtn').addEventListener('click', runRandomSimulation);
    document.getElementById('runManualSimBtn').addEventListener('click', runManualSimulation);
    document.getElementById('runTimeSimBtn').addEventListener('click', runTimeBasedSimulation);
});



