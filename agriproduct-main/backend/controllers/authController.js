const Joi = require('joi');
const jwt = require('jsonwebtoken');
const Farmer = require('../models/Farmer');
const { generateOTP, saveOTP, verifyOTP } = require('../services/otpService');
const { successResponse } = require('../utils/apiResponse');

// Validation schemas
const registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    phone: Joi.string().pattern(/^[6-9]\d{9}$/).required().messages({
        'string.pattern.base': 'Phone must be a valid 10-digit Indian mobile number',
    }),
    state: Joi.string().min(2).required(),
    district: Joi.string().min(2).required(),
});

const otpSchema = Joi.object({
    phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
});

const verifySchema = Joi.object({
    phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
    otp: Joi.string().length(6).required(),
});

// @desc    Register a new farmer
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
    try {
        const { error } = registerSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const msg = error.details.map((d) => d.message.replace(/"/g, '')).join(', ');
            return res.status(400).json({ success: false, message: msg });
        }

        const { name, phone, state, district } = req.body;

        const existing = await Farmer.findOne({ phone });
        if (existing) {
            return res.status(400).json({ success: false, message: 'A farmer with this phone number already exists.' });
        }

        const farmer = await Farmer.create({
            name,
            phone,
            location: { state, district },
        });

        return successResponse(res, 201, 'Farmer registered successfully.', {
            farmerId: farmer._id,
            name: farmer.name,
            phone: farmer.phone,
            location: farmer.location,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Send OTP to phone (simulated)
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res, next) => {
    try {
        const { error } = otpSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const { phone } = req.body;

        const farmer = await Farmer.findOne({ phone });
        if (!farmer) {
            return res.status(404).json({ success: false, message: 'No farmer registered with this phone number. Please register first.' });
        }

        const otp = generateOTP();
        saveOTP(phone, otp);

        // In production: send via SMS provider. For MVP, return in response.
        return successResponse(res, 200, 'OTP sent successfully.', {
            otp, // Remove this in production!
            note: 'OTP is shown in response for development/testing only.',
            expiresInMinutes: 5,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Verify OTP and return JWT
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res, next) => {
    try {
        const { error } = verifySchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const { phone, otp } = req.body;

        const result = verifyOTP(phone, otp);
        if (!result.valid) {
            return res.status(401).json({ success: false, message: result.reason });
        }

        const farmer = await Farmer.findOne({ phone }).populate('crops');
        if (!farmer) {
            return res.status(404).json({ success: false, message: 'Farmer not found.' });
        }

        const token = jwt.sign(
            { farmerId: farmer._id, phone: farmer.phone },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        return successResponse(res, 200, 'Login successful.', {
            token,
            farmer: {
                id: farmer._id,
                name: farmer.name,
                phone: farmer.phone,
                location: farmer.location,
                cropsCount: farmer.crops.length,
            },
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get current logged-in farmer profile
// @route   GET /api/auth/me
// @access  Protected
const getMe = async (req, res, next) => {
    try {
        const farmer = await Farmer.findById(req.farmer._id).populate('crops');
        return successResponse(res, 200, 'Profile fetched successfully.', { farmer });
    } catch (err) {
        next(err);
    }
};

module.exports = { register, sendOtp, verifyOtp, getMe };
