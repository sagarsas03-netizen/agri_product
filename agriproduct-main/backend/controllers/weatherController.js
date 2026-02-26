const WeatherLog = require('../models/WeatherLog');
const { getWeather } = require('../services/weatherService');
const { successResponse } = require('../utils/apiResponse');

// @desc    Get weather for a location
// @route   GET /api/weather/:location
// @access  Public
const getWeatherData = async (req, res, next) => {
    try {
        const { location } = req.params;

        if (!location || location.trim().length < 2) {
            return res.status(400).json({ success: false, message: 'Please provide a valid location name.' });
        }

        const weatherData = await getWeather(location.trim());

        // Log to DB (non-blocking, fire and forget)
        WeatherLog.create(weatherData).catch(() => { });

        return successResponse(res, 200, `Weather data for ${location}.`, weatherData);
    } catch (err) {
        next(err);
    }
};

module.exports = { getWeatherData };
