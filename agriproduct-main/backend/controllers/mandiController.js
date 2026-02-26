const Price = require('../models/Price');
const { haversineDistance } = require('../services/haversineService');
const mandis = require('../data/mandis');
const { successResponse } = require('../utils/apiResponse');

// @desc    Get 5 nearest mandis to a location with crop price
// @route   GET /api/mandis/nearby?lat=20.0&lon=73.7&cropName=Wheat
// @access  Public
const getNearbyMandis = async (req, res, next) => {
    try {
        const { lat, lon, cropName } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({ success: false, message: 'lat and lon query parameters are required.' });
        }

        const userLat = parseFloat(lat);
        const userLon = parseFloat(lon);

        if (isNaN(userLat) || isNaN(userLon)) {
            return res.status(400).json({ success: false, message: 'lat and lon must be valid numbers.' });
        }

        // Compute distance from user to every mandi, sort by distance
        const mandisWithDistance = mandis
            .map((m) => ({
                ...m,
                distance: haversineDistance(userLat, userLon, m.lat, m.lon),
            }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5);

        // Enrich with current crop price if cropName provided
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const enriched = await Promise.all(
            mandisWithDistance.map(async (mandi) => {
                let cropPrice = null;
                if (cropName) {
                    const priceRecord = await Price.findOne({
                        cropName: { $regex: new RegExp(`^${cropName}$`, 'i') },
                        mandiName: { $regex: new RegExp(`^${mandi.name}$`, 'i') },
                        date: { $gte: sevenDaysAgo },
                    }).sort({ date: -1 });

                    if (!priceRecord) {
                        // Fallback: use state-level data
                        const stateFallback = await Price.findOne({
                            cropName: { $regex: new RegExp(`^${cropName}$`, 'i') },
                            state: { $regex: new RegExp(`^${mandi.state}$`, 'i') },
                            date: { $gte: sevenDaysAgo },
                        }).sort({ price: -1 });

                        if (stateFallback) {
                            cropPrice = { price: stateFallback.price, unit: stateFallback.unit, source: 'state-level' };
                        }
                    } else {
                        cropPrice = { price: priceRecord.price, unit: priceRecord.unit, source: 'mandi' };
                    }
                }

                return {
                    id: mandi.id,
                    name: mandi.name,
                    state: mandi.state,
                    district: mandi.district,
                    coordinates: { lat: mandi.lat, lon: mandi.lon },
                    distance: `${mandi.distance} km`,
                    distanceKm: mandi.distance,
                    cropPrice: cropName ? cropPrice : undefined,
                };
            })
        );

        return successResponse(res, 200, `5 nearest mandis found.`, {
            userLocation: { lat: userLat, lon: userLon },
            cropName: cropName || null,
            mandis: enriched,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all available mandis (for reference)
// @route   GET /api/mandis
// @access  Public
const getAllMandis = async (req, res, next) => {
    try {
        return successResponse(res, 200, `${mandis.length} mandis available.`, { mandis });
    } catch (err) {
        next(err);
    }
};

module.exports = { getNearbyMandis, getAllMandis };
