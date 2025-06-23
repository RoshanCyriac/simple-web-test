// API Base URL - will be same domain in production
const API_BASE = window.location.origin;

// DOM Elements
const connectionStatus = document.getElementById('connection-status');
const apiResponse = document.getElementById('api-response');
const appStatus = document.getElementById('app-status');
const lastUpdated = document.getElementById('last-updated');

// Button elements
const healthCheckBtn = document.getElementById('health-check');
const getDataBtn = document.getElementById('get-data');
const postDataBtn = document.getElementById('post-data');

// Utility functions
function updateTimestamp() {
    lastUpdated.textContent = new Date().toLocaleString();
}

function showLoading(button) {
    button.classList.add('loading');
    button.disabled = true;
}

function hideLoading(button) {
    button.classList.remove('loading');
    button.disabled = false;
}

function displayResponse(data, isError = false) {
    apiResponse.innerHTML = `
        <div class="response-data ${isError ? 'error' : ''}">${JSON.stringify(data, null, 2)}</div>
    `;
}

function updateConnectionStatus(connected, message = '') {
    connectionStatus.className = 'status-indicator';
    if (connected) {
        connectionStatus.classList.add('status-connected');
        connectionStatus.innerHTML = `
            <div>✅ Backend Connected</div>
            ${message ? `<small>${message}</small>` : ''}
        `;
        appStatus.textContent = 'Online';
    } else {
        connectionStatus.classList.add('status-disconnected');
        connectionStatus.innerHTML = `
            <div>❌ Backend Disconnected</div>
            ${message ? `<small>${message}</small>` : ''}
        `;
        appStatus.textContent = 'Offline';
    }
    updateTimestamp();
}

// API call functions
async function makeApiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('API call failed:', error);
        return { 
            success: false, 
            error: {
                message: error.message,
                type: error.name,
                timestamp: new Date().toISOString()
            }
        };
    }
}

// Health check function
async function performHealthCheck() {
    showLoading(healthCheckBtn);
    
    const result = await makeApiCall('/api/health');
    
    if (result.success) {
        updateConnectionStatus(true, `Uptime: ${Math.floor(result.data.uptime)}s`);
        displayResponse(result.data);
    } else {
        updateConnectionStatus(false, result.error.message);
        displayResponse(result.error, true);
    }
    
    hideLoading(healthCheckBtn);
}

// Get data function
async function getData() {
    showLoading(getDataBtn);
    
    const result = await makeApiCall('/api/data');
    
    if (result.success) {
        displayResponse(result.data);
        updateConnectionStatus(true, 'Data fetched successfully');
    } else {
        displayResponse(result.error, true);
        updateConnectionStatus(false, 'Failed to fetch data');
    }
    
    hideLoading(getDataBtn);
}

// Post data function
async function postData() {
    showLoading(postDataBtn);
    
    const testData = {
        message: 'Hello from frontend!',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        testNumber: Math.floor(Math.random() * 1000)
    };
    
    const result = await makeApiCall('/api/echo', {
        method: 'POST',
        body: JSON.stringify(testData)
    });
    
    if (result.success) {
        displayResponse(result.data);
        updateConnectionStatus(true, 'POST request successful');
    } else {
        displayResponse(result.error, true);
        updateConnectionStatus(false, 'POST request failed');
    }
    
    hideLoading(postDataBtn);
}

// Event listeners
healthCheckBtn.addEventListener('click', performHealthCheck);
getDataBtn.addEventListener('click', getData);
postDataBtn.addEventListener('click', postData);

// Initial connection check on page load
async function initializeApp() {
    console.log('🚀 Initializing Basic Web App...');
    
    // Perform initial health check
    await performHealthCheck();
    
    // Set up periodic health checks (every 30 seconds)
    setInterval(async () => {
        const result = await makeApiCall('/api/health');
        if (result.success) {
            updateConnectionStatus(true, `Uptime: ${Math.floor(result.data.uptime)}s`);
        } else {
            updateConnectionStatus(false, 'Connection lost');
        }
    }, 30000);
    
    console.log('✅ App initialization complete');
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Handle offline/online events
window.addEventListener('online', () => {
    console.log('🌐 Network connection restored');
    performHealthCheck();
});

window.addEventListener('offline', () => {
    console.log('📡 Network connection lost');
    updateConnectionStatus(false, 'No internet connection');
});

// Error handling for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    updateConnectionStatus(false, 'Unexpected error occurred');
});

// Export functions for debugging (available in browser console)
window.debugAPI = {
    healthCheck: performHealthCheck,
    getData: getData,
    postData: postData,
    makeApiCall: makeApiCall
}; 