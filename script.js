async function getWeather() {
    const apikey = '0ed722f04f1b29d55b117934a522aaa9';
    const city = document.getElementById('city').value.trim();

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}`;

    try {
        // Fetch current weather
        const currentWeatherResponse = await fetch(currentWeatherUrl);
        if (!currentWeatherResponse.ok) {
            throw new Error('City not found');
        }
        const currentWeatherData = await currentWeatherResponse.json();
        displayWeather(currentWeatherData);

        // Fetch hourly forecast
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();
        displayHourlyForecast(forecastData.list);
    } catch (error) {
        console.error('Error:', error.message);
        alert('Error fetching weather data. Please try again.');
    }
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');

    // Clear previous content
    tempDivInfo.innerHTML = '';
    weatherInfoDiv.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
        return;
    }

    const cityName = data.name;
    const temperature = Math.round(data.main.temp - 273.15); // Convert from Kelvin to Celsius
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    const temperatureHTML = `
        <p><strong>${cityName}</strong></p>
        <p>${temperature}°C</p>
        <p>${description}</p>
    `;

    tempDivInfo.innerHTML = temperatureHTML;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;
    weatherIcon.style.display = 'block'; // Show the icon
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    hourlyForecastDiv.innerHTML = ''; // Clear previous content

    const next24Hours = hourlyData.slice(0, 8); // Get the next 8 data points (3-hour intervals)

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15); // Convert from Kelvin to Celsius
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;
        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}
