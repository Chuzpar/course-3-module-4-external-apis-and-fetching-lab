// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!
const stateInput = document.getElementById('state-input');
const fetchBtn = document.getElementById('fetch-alerts');
const alertsContainer = document.getElementById('alerts-container');
const errorDiv = document.getElementById('error-message');

function clearUI() {
    errorDiv.classList.add('hidden');
    errorDiv.textContent = '';
    alertsContainer.innerHTML = '';
}

function displayError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    alertsContainer.innerHTML = ''; // clear any previous alerts
}

function displayAlerts(data, stateAbbr) {
    const title = data.title || `Alerts for ${stateAbbr.toUpperCase()}`;
    const alertCount = data.features ? data.features.length : 0;

    const summary = document.createElement('div');
    summary.className = 'alert-summary';
    summary.textContent = `${title}: ${alertCount}`;

    const list = document.createElement('ul');
    list.className = 'alert-list';

    if (alertCount === 0) {
        const noAlerts = document.createElement('li');
        noAlerts.textContent = 'No active alerts for this state.';
        list.appendChild(noAlerts);
    } else {
        data.features.forEach(feature => {
            const headline = feature.properties?.headline || 'No headline available';
            const listItem = document.createElement('li');
            listItem.textContent = headline;
            list.appendChild(listItem);
        });
    }

    alertsContainer.innerHTML = '';
    alertsContainer.appendChild(summary);
    alertsContainer.appendChild(list);
}

async function fetchWeatherAlerts(stateAbbr) {
    if (!stateAbbr || stateAbbr.length !== 2 || !/^[A-Za-z]{2}$/.test(stateAbbr)) {
        displayError('Please enter a valid two-letter state abbreviation (e.g., NY, CA).');
        return;
    }

    const upperState = stateAbbr.toUpperCase();
    const url = `https://api.weather.gov/alerts/active?area=${upperState}`;

    clearUI(); 
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayAlerts(data, upperState);
    } catch (error) {
        console.error('Fetch error:', error);
        displayError('Failed to fetch weather alerts. Please check your network and try again.');
    }
}

function onFetchClick() {
    const state = stateInput.value.trim();
    stateInput.value = '';
    fetchWeatherAlerts(state);
}

fetchBtn.addEventListener('click', onFetchClick);

stateInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        onFetchClick();
    }
});