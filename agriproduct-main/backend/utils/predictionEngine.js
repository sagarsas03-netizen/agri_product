/**
 * Simple AI Price Prediction Engine
 * Uses linear regression with seasonal variance simulation
 */

const Price = require('../models/Price');

/**
 * Fetches last 30 days of price data and returns 7-day prediction
 * @param {string} cropName
 * @returns {Array} - Array of { date, predictedPrice }
 */
const predictPrices = async (cropName) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get historical data aggregated by date
    const history = await Price.aggregate([
        {
            $match: {
                cropName: { $regex: new RegExp(`^${cropName}$`, 'i') },
                date: { $gte: thirtyDaysAgo },
            },
        },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                avgPrice: { $avg: '$price' },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    let basePrice = 2000; // default fallback
    let trend = 0;

    if (history.length >= 2) {
        const prices = history.map((h) => h.avgPrice);
        basePrice = prices[prices.length - 1];

        // Simple linear regression slope
        const n = prices.length;
        const sumX = (n * (n - 1)) / 2;
        const sumY = prices.reduce((a, b) => a + b, 0);
        const sumXY = prices.reduce((acc, p, i) => acc + i * p, 0);
        const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;
        trend = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    } else if (history.length === 1) {
        basePrice = history[0].avgPrice;
    }

    // Generate 7-day predictions
    const predictions = [];
    const today = new Date();

    for (let day = 1; day <= 7; day++) {
        const forecastDate = new Date(today);
        forecastDate.setDate(today.getDate() + day);

        // Add seasonal noise (±3%)
        const noise = (Math.random() - 0.5) * 0.06 * basePrice;
        const predictedPrice = Math.max(500, Math.round(basePrice + trend * day + noise));

        predictions.push({
            date: forecastDate.toISOString().split('T')[0],
            predictedPrice,
            confidence: Math.round(85 - day * 3), // confidence decreases per day
        });
    }

    return {
        cropName,
        basedOnDays: history.length,
        trend: trend > 0 ? 'rising' : trend < 0 ? 'falling' : 'stable',
        trendValue: Math.round(trend * 100) / 100,
        predictions,
    };
};

module.exports = { predictPrices };
