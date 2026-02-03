document.addEventListener("DOMContentLoaded", function() {
  document.getElementById('weatherForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const locationType = document.querySelector('input[name="locationType"]:checked').value;
    const locationInput = document.getElementById('locationInput').value;
    fetchWeatherData(locationType, locationInput);
  });
});

function fetchWeatherData(locationType, locationInput) {
  const apiKey = API_KEY;
  let url = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&units=metric`;

  switch (locationType) {
    case 'city':
      url += `&q=${encodeURIComponent(locationInput)}`;
      break;
    case 'zip':
      if (!/^\d{5}(-\d{4})?$/.test(locationInput)) {
        displayError('Invalid ZIP code format');
        return;
      }
      url += `&zip=${encodeURIComponent(locationInput)}`;
      break;
    case 'coordinates':
      const coords = locationInput.split(',');
      if (coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) {
        displayError('Invalid coordinates format. Please use "lat,lon".');
        return;
      }
      const [lat, lon] = coords.map(coord => coord.trim());
      url += `&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
      break;
    default:
      displayError('Invalid location type');
      return;
  }

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.cod !== "200") {
        throw new Error(data.message || 'Location not found');
      }
      processWeatherData(data);
    })
    .catch(error => displayError(`Error: ${error.message}`));
}

function processWeatherData(data) {
  const forecast = {};
  data.list.forEach(point => {
    const date = new Date(point.dt * 1000);
    const dayKey = date.toISOString().split('T')[0];

    if (!forecast[dayKey]) {
      forecast[dayKey] = {
        temps: [],
        pressures: [],
        cloudiness: [],
      };
    }

    forecast[dayKey].temps.push(point.main.temp_max);
    forecast[dayKey].pressures.push(point.main.pressure);
    forecast[dayKey].cloudiness.push(point.clouds.all);
  });

  displayForecast(forecast);
}

function displayForecast(forecast) {
  const weatherDataDiv = document.getElementById('weatherData');
  weatherDataDiv.innerHTML = ''; // Clear previous data
  const dates = Object.keys(forecast).sort().slice(1, 4);

  dates.forEach(day => {
    const { temps, pressures, cloudiness } = forecast[day];
    const maxTemp = Math.max(...temps);
    const avgCloudiness = cloudiness.reduce((acc, val) => acc + val, 0) / cloudiness.length;
    const maxPressure = Math.max(...pressures);
    const readableDate = new Date(day).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    weatherDataDiv.innerHTML += `
            <div>
                <h3>Forecast for ${readableDate}</h3>
                <p>Max Temperature: ${maxTemp.toFixed(2)}°C</p>
                <p>Average Cloudiness: ${avgCloudiness.toFixed(2)}%</p>
                <p>Max Pressure: ${maxPressure} hPa</p>
            </div>
        `;
  });
}

function displayError(message) {
  const weatherDataDiv = document.getElementById('weatherData');
  weatherDataDiv.innerHTML = `<p>${message}</p>`;
}
