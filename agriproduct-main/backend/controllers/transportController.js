const Joi = require('joi');
const Price = require('../models/Price');
const TransportRequest = require('../models/TransportRequest');
const { haversineDistance } = require('../services/haversineService');
const mandis = require('../data/mandis');
const { successResponse } = require('../utils/apiResponse');

const transportSchema = Joi.object({
    cropName: Joi.string().required(),
    quantity: Joi.number().min(1).required(),
    sourceLat: Joi.number().min(-90).max(90).required(),
    sourceLon: Joi.number().min(-180).max(180).required(),
    destinationMandiId: Joi.string().required(),
});

// @desc    Calculate transport cost and net profit
// @route   POST /api/transport/calculate
// @access  Public (or Protected if farmer logged in)
const calculateTransport = async (req, res, next) => {
    try {
        const { error } = transportSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const { cropName, quantity, sourceLat, sourceLon, destinationMandiId } = req.body;

        // Find destination mandi
        const destMandi = mandis.find((m) => m.id === destinationMandiId);
        if (!destMandi) {
            return res.status(404).json({ success: false, message: `Mandi with ID '${destinationMandiId}' not found.` });
        }

        // Calculate distance using Haversine
        const distance = haversineDistance(sourceLat, sourceLon, destMandi.lat, destMandi.lon);

        // Get highest price at destination mandi for the crop
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 7);

        const highestPriceRecord = await Price.findOne({
            cropName: { $regex: new RegExp(`^${cropName}$`, 'i') },
            state: { $regex: new RegExp(`^${destMandi.state}$`, 'i') },
            date: { $gte: thirtyDaysAgo },
        }).sort({ price: -1 });

        const highestPrice = highestPriceRecord ? highestPriceRecord.price : 2000; // fallback ₹2000/quintal

        // Cost formulas
        const RATE_PER_KM = 12; // ₹12 per km
        const COMMISSION_RATE = 0.03; // 3%

        const transportCost = Math.round(distance * RATE_PER_KM);
        const commission = Math.round(highestPrice * quantity * COMMISSION_RATE);
        const grossRevenue = Math.round(highestPrice * quantity);
        const netProfit = grossRevenue - transportCost - commission;

        // Log request (optional, don't fail if farmer not logged in)
        const logData = {
            cropName,
            quantity,
            source: { lat: sourceLat, lon: sourceLon },
            destination: {
                mandiId: destMandi.id,
                mandiName: destMandi.name,
                lat: destMandi.lat,
                lon: destMandi.lon,
                state: destMandi.state,
            },
            distance,
            transportCost,
            commission,
            commissionRate: COMMISSION_RATE * 100,
            highestPrice,
            netProfit,
        };

        if (req.farmer) logData.farmerId = req.farmer._id;
        await TransportRequest.create(logData);

        return successResponse(res, 200, 'Transport calculation complete.', {
            cropName,
            quantity,
            unit: 'quintal',
            destination: {
                mandiId: destMandi.id,
                mandiName: destMandi.name,
                state: destMandi.state,
                district: destMandi.district,
            },
            distance: `${distance} km`,
            highestPricePerQuintal: highestPrice,
            grossRevenue,
            transportCost,
            commission,
            commissionRate: `${COMMISSION_RATE * 100}%`,
            netProfit,
            profitMargin: `${Math.round((netProfit / grossRevenue) * 100)}%`,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { calculateTransport };
