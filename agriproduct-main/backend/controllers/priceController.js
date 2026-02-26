const Price = require('../models/Price');
const { successResponse } = require('../utils/apiResponse');

// @desc    Get latest local mandi price for farmer's state + crop
// @route   GET /api/prices/local?cropName=Wheat
// @access  Protected
const getLocalPrice = async (req, res, next) => {
    try {
        const { cropName } = req.query;
        if (!cropName) return res.status(400).json({ success: false, message: 'cropName query parameter is required.' });

        const state = req.farmer.location.state;

        const prices = await Price.find({
            cropName: { $regex: new RegExp(`^${cropName}$`, 'i') },
            state: { $regex: new RegExp(`^${state}$`, 'i') },
        })
            .sort({ date: -1 })
            .limit(10);

        if (!prices.length) {
            return res.status(404).json({ success: false, message: `No price data found for ${cropName} in ${state}.` });
        }

        // Get the best (highest) price mandi today
        const latestDate = prices[0].date;
        const todayPrices = await Price.find({
            cropName: { $regex: new RegExp(`^${cropName}$`, 'i') },
            state: { $regex: new RegExp(`^${state}$`, 'i') },
            date: { $gte: new Date(new Date(latestDate).setHours(0, 0, 0, 0)) },
        }).sort({ price: -1 });

        return successResponse(res, 200, 'Local mandi prices fetched.', {
            cropName,
            state,
            bestPrice: todayPrices[0] || prices[0],
            allMandis: todayPrices.length ? todayPrices : prices.slice(0, 5),
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get highest price across India for a crop
// @route   GET /api/prices/highest?cropName=Wheat
// @access  Public
const getHighestPrice = async (req, res, next) => {
    try {
        const { cropName } = req.query;
        if (!cropName) return res.status(400).json({ success: false, message: 'cropName query parameter is required.' });

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 7);

        const highest = await Price.findOne({
            cropName: { $regex: new RegExp(`^${cropName}$`, 'i') },
            date: { $gte: thirtyDaysAgo },
        }).sort({ price: -1 });

        if (!highest) {
            return res.status(404).json({ success: false, message: `No price data found for ${cropName}.` });
        }

        return successResponse(res, 200, 'Highest India price fetched.', {
            cropName,
            highestPrice: highest.price,
            mandiName: highest.mandiName,
            state: highest.state,
            date: highest.date,
            unit: highest.unit,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get highest price per state for a crop
// @route   GET /api/prices/highest-states?cropName=Wheat
// @access  Public
const getHighestPerState = async (req, res, next) => {
    try {
        const { cropName } = req.query;
        if (!cropName) return res.status(400).json({ success: false, message: 'cropName query parameter is required.' });

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 7);

        const result = await Price.aggregate([
            {
                $match: {
                    cropName: { $regex: new RegExp(`^${cropName}$`, 'i') },
                    date: { $gte: thirtyDaysAgo },
                },
            },
            {
                $group: {
                    _id: '$state',
                    highestPrice: { $max: '$price' },
                    mandiName: { $first: '$mandiName' },
                    date: { $first: '$date' },
                    unit: { $first: '$unit' },
                },
            },
            {
                $project: {
                    _id: 0,
                    state: '$_id',
                    highestPrice: 1,
                    mandiName: 1,
                    date: 1,
                    unit: 1,
                },
            },
            { $sort: { highestPrice: -1 } },
        ]);

        return successResponse(res, 200, 'State-wise highest prices fetched.', {
            cropName,
            states: result,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get price history for last 30 days
// @route   GET /api/prices/history/:cropName
// @access  Public
const getPriceHistory = async (req, res, next) => {
    try {
        const { cropName } = req.params;
        const { state } = req.query;

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const matchQuery = {
            cropName: { $regex: new RegExp(`^${cropName}$`, 'i') },
            date: { $gte: thirtyDaysAgo },
        };
        if (state) matchQuery.state = { $regex: new RegExp(`^${state}$`, 'i') };

        const history = await Price.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                    avgPrice: { $avg: '$price' },
                    maxPrice: { $max: '$price' },
                    minPrice: { $min: '$price' },
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    avgPrice: { $round: ['$avgPrice', 2] },
                    maxPrice: 1,
                    minPrice: 1,
                    count: 1,
                },
            },
            { $sort: { date: 1 } },
        ]);

        return successResponse(res, 200, `Price history for ${cropName} (last 30 days).`, {
            cropName,
            state: state || 'All India',
            days: history.length,
            history,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { getLocalPrice, getHighestPrice, getHighestPerState, getPriceHistory };
