const mongoose = require('mongoose');

const weatherLogSchema = new mongoose.Schema(
    {
        location: { type: String, required: true },
        temperature: Number,
        feelsLike: Number,
        humidity: Number,
        windSpeed: Number,
        condition: String,
        description: String,
        alert: { type: Boolean, default: false },
        alertMessage: String,
        forecast: [
            {
                date: String,
                tempMin: Number,
                tempMax: Number,
                condition: String,
                description: String,
            },
        ],
        source: { type: String, default: 'simulated' },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('WeatherLog', weatherLogSchema);
