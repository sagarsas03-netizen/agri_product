const { predictPrices } = require('../utils/predictionEngine');
const { successResponse } = require('../utils/apiResponse');

// @desc    Predict next 7-day prices for a crop
// @route   GET /api/predict-price/:cropName
// @access  Public
const predictPrice = async (req, res, next) => {
    try {
        const { cropName } = req.params;
        if (!cropName) {
            return res.status(400).json({ success: false, message: 'cropName parameter is required.' });
        }

        const result = await predictPrices(cropName);

        return successResponse(res, 200, `7-day price prediction for ${cropName}.`, result);
    } catch (err) {
        next(err);
    }
};

module.exports = { predictPrice };
