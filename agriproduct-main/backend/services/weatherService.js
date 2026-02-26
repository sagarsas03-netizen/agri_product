const axios = require('axios');

/**
 * Weather conditions that trigger an alert
 */
const isAlertCondition = ({ temperature, windSpeed, humidity }) => {
    if (temperature > 40) return { alert: true, message: '⚠️ Extreme heat warning! Temperature exceeds 40°C. Avoid outdoor farming activities.' };
    if (temperature < 5) return { alert: true, message: '⚠️ Frost warning! Temperature below 5°C. Protect crops from frost damage.' };
    if (windSpeed > 60) return { alert: true, message: '⚠️ High wind warning! Wind speed exceeds 60 km/h. Secure farm structures.' };
    if (humidity > 90) return { alert: true, message: '⚠️ Very high humidity! Risk of fungal disease. Monitor crops closely.' };
    return { alert: false, message: null };
};

/**
 * Simulate weather data for a given location (used as fallback or MVP)
 */
const getSimulatedWeather = (location) => {
    const locationHash = location.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const seed = locationHash % 100;

    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Thunderstorm', 'Foggy', 'Windy'];
    const conditionIdx = seed % conditions.length;
    const condition = conditions[conditionIdx];

    const temperature = 18 + (seed % 25); // 18°C to 43°C
    const humidity = 40 + (seed % 50); // 40% to 90%
    const windSpeed = 5 + (seed % 40); // 5 to 45 km/h

    const alertInfo = isAlertCondition({ temperature, windSpeed, humidity });

    const today = new Date();
    const forecast = [];
    for (let i = 1; i <= 3; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const variation = (Math.random() - 0.5) * 6;
        const forecastCondIdx = (conditionIdx + i) % conditions.length;
        forecast.push({
            date: d.toISOString().split('T')[0],
            tempMin: Math.round(temperature - 5 + variation),
            tempMax: Math.round(temperature + 3 + variation),
            condition: conditions[forecastCondIdx],
            description: `${conditions[forecastCondIdx]} with mild breeze`,
        });
    }

    return {
        location,
        temperature,
        feelsLike: temperature - 2,
        humidity,
        windSpeed,
        condition,
        description: `${condition} day in ${location}`,
        alert: alertInfo.alert,
        alertMessage: alertInfo.message,
        forecast,
        source: 'simulated',
    };
};

/**
 * Fetch live weather from OpenWeather API
 */
const getLiveWeather = async (location) => {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey || apiKey === 'your_openweather_api_key_here') {
        throw new Error('No API key');
    }

    const currentRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)},IN&appid=${apiKey}&units=metric`
    );

    const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)},IN&appid=${apiKey}&units=metric&cnt=9`
    );

    const cur = currentRes.data;
    const temperature = cur.main.temp;
    const humidity = cur.main.humidity;
    const windSpeed = Math.round(cur.wind.speed * 3.6); // m/s to km/h

    const alertInfo = isAlertCondition({ temperature, windSpeed, humidity });

    // Extract 3-day forecast (every 8 slots = 1 day in 3hour intervals)
    const forecastList = forecastRes.data.list;
    const forecast = [];
    const seenDates = new Set();
    for (const item of forecastList) {
        const date = item.dt_txt.split(' ')[0];
        if (!seenDates.has(date) && forecast.length < 3) {
            seenDates.add(date);
            forecast.push({
                date,
                tempMin: Math.round(item.main.temp_min),
                tempMax: Math.round(item.main.temp_max),
                condition: item.weather[0].main,
                description: item.weather[0].description,
            });
        }
    }

    return {
        location,
        temperature: Math.round(temperature),
        feelsLike: Math.round(cur.main.feels_like),
        humidity,
        windSpeed,
        condition: cur.weather[0].main,
        description: cur.weather[0].description,
        alert: alertInfo.alert,
        alertMessage: alertInfo.message,
        forecast,
        source: 'openweather',
    };
};

/**
 * Main weather fetch function: tries live API first, falls back to simulation
 */
const getWeather = async (location) => {
    try {
        return await getLiveWeather(location);
    } catch {
        return getSimulatedWeather(location);
    }
};

module.exports = { getWeather };
