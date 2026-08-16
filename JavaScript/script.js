const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const weatherDescription = document.getElementById("weatherDescription");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const errorMessage = document.getElementById("errorMessage");
const loadingMessage = document.getElementById("loadingMessage");
const dateTime = document.getElementById("dateTime");

searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        getWeather();
    }
});

async function getWeather() {

    const city = cityInput.value.trim();

    if (city === "") {
        errorMessage.textContent = "Please enter a city name.";
        return;
    }

    errorMessage.textContent = "";
    loadingMessage.textContent = "Loading weather data...";

    try {

        // Find city coordinates
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!geoResponse.ok) {
            throw new Error("Unable to find the city.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found.");
        }

        const location = geoData.results[0];

        // Get weather data
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
        );

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data.");
        }

        const weatherData = await weatherResponse.json();

        loadingMessage.textContent = "";

        // Display city
        cityName.textContent = `${location.name}, ${location.country}`;

        // Display temperature
        temperature.textContent =
            `${weatherData.current.temperature_2m} °C`;

        // Display humidity
        humidity.textContent =
            `${weatherData.current.relative_humidity_2m} %`;

        // Display wind speed
        windSpeed.textContent =
            `${weatherData.current.wind_speed_10m} km/h`;

        // Display weather description and icon
        const weatherCode = weatherData.current.weather_code;

        weatherDescription.textContent =
            getWeatherDescription(weatherCode);

        weatherIcon.textContent =
            getWeatherIcon(weatherCode);

    } catch (error) {

        loadingMessage.textContent = "";
        errorMessage.textContent = error.message;
    }
}


function getWeatherDescription(code) {

    if (code === 0) return "Clear Sky";

    if (code === 1 || code === 2 || code === 3)
        return "Partly Cloudy";

    if (code === 45 || code === 48)
        return "Foggy";

    if (code >= 51 && code <= 57)
        return "Drizzle";

    if (code >= 61 && code <= 67)
        return "Rain";

    if (code >= 71 && code <= 77)
        return "Snow";

    if (code >= 80 && code <= 82)
        return "Rain Showers";

    if (code >= 85 && code <= 86)
        return "Snow Showers";

    if (code >= 95)
        return "Thunderstorm";

    return "Unknown Weather";
}


function getWeatherIcon(code) {

    if (code === 0) return "Clear Sky ☀️";

    if (code === 1 || code === 2 || code === 3)
        return "Partly Cloudy ⛅";

    if (code === 45 || code === 48)
        return "Foggy 🌫️";

    if (code >= 51 && code <= 57)
        return "Drizzle 🌦️";

    if (code >= 61 && code <= 67)
        return "Rain 🌧️";

    if (code >= 71 && code <= 77)
        return "Snow ❄️";

    if (code >= 80 && code <= 82)
        return "Rain Showers 🌦️";

    if (code >= 85 && code <= 86)
        return "Snow Showers 🌨️";

    if (code >= 95)
        return "Thunderstorm ⛈️";

    return "Unknown Weather 🌤️";
}


function updateDateTime() {

    const now = new Date();

    dateTime.textContent = now.toLocaleString();
}

updateDateTime();

setInterval(updateDateTime, 1000);