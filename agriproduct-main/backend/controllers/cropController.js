const Joi = require('joi');
const Crop = require('../models/Crop');
const Farmer = require('../models/Farmer');
const Price = require('../models/Price');
const { successResponse } = require('../utils/apiResponse');

const cropSchema = Joi.object({
    cropName: Joi.string().min(2).max(50).required(),
    quantity: Joi.number().min(0).required(),
    unit: Joi.string().valid('kg', 'quintal', 'ton').default('kg'),
});

const updateSchema = Joi.object({
    quantity: Joi.number().min(0).required(),
    unit: Joi.string().valid('kg', 'quintal', 'ton'),
});

// @desc    Add a crop to the farmer's profile
// @route   POST /api/crops
// @access  Protected
const addCrop = async (req, res, next) => {
    try {
        const { error } = cropSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const { cropName, quantity, unit } = req.body;
        const farmer = req.farmer;

        const crop = await Crop.create({
            cropName: cropName.trim(),
            quantity,
            unit: unit || 'kg',
            farmerId: farmer._id,
        });

        // Link crop to farmer
        await Farmer.findByIdAndUpdate(farmer._id, { $push: { crops: crop._id } });

        // Auto-fetch latest mandi price for this crop in farmer's state
        const latestPrice = await Price.findOne({
            cropName: { $regex: new RegExp(`^${cropName}$`, 'i') },
            state: farmer.location.state,
        }).sort({ date: -1 });

        return successResponse(res, 201, 'Crop added successfully.', {
            crop,
            latestMandiPrice: latestPrice
                ? {
                    price: latestPrice.price,
                    unit: latestPrice.unit,
                    mandiName: latestPrice.mandiName,
                    state: latestPrice.state,
                    date: latestPrice.date,
                }
                : null,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all crops for the logged-in farmer
// @route   GET /api/crops
// @access  Protected
const getMyCrops = async (req, res, next) => {
    try {
        const crops = await Crop.find({ farmerId: req.farmer._id }).sort({ createdAt: -1 });

        // Enrich each crop with latest price
        const enriched = await Promise.all(
            crops.map(async (crop) => {
                const latestPrice = await Price.findOne({
                    cropName: { $regex: new RegExp(`^${crop.cropName}$`, 'i') },
                    state: req.farmer.location.state,
                }).sort({ date: -1 });

                return {
                    ...crop.toObject(),
                    latestMandiPrice: latestPrice
                        ? { price: latestPrice.price, mandiName: latestPrice.mandiName, date: latestPrice.date }
                        : null,
                };
            })
        );

        return successResponse(res, 200, `Found ${crops.length} crop(s).`, { crops: enriched });
    } catch (err) {
        next(err);
    }
};

// @desc    Update crop quantity
// @route   PUT /api/crops/:id
// @access  Protected
const updateCrop = async (req, res, next) => {
    try {
        const { error } = updateSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const crop = await Crop.findOne({ _id: req.params.id, farmerId: req.farmer._id });
        if (!crop) return res.status(404).json({ success: false, message: 'Crop not found or not owned by you.' });

        crop.quantity = req.body.quantity;
        if (req.body.unit) crop.unit = req.body.unit;
        await crop.save();

        return successResponse(res, 200, 'Crop updated successfully.', { crop });
    } catch (err) {
        next(err);
    }
};

// @desc    Remove a crop
// @route   DELETE /api/crops/:id
// @access  Protected
const removeCrop = async (req, res, next) => {
    try {
        const crop = await Crop.findOne({ _id: req.params.id, farmerId: req.farmer._id });
        if (!crop) return res.status(404).json({ success: false, message: 'Crop not found or not owned by you.' });

        await crop.deleteOne();
        await Farmer.findByIdAndUpdate(req.farmer._id, { $pull: { crops: crop._id } });

        return successResponse(res, 200, 'Crop removed successfully.', { cropId: req.params.id });
    } catch (err) {
        next(err);
    }
};

module.exports = { addCrop, getMyCrops, updateCrop, removeCrop };
