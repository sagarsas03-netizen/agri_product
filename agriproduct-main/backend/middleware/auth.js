const jwt = require('jsonwebtoken');
const Farmer = require('../models/Farmer');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized. No token provided.',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.farmer = await Farmer.findById(decoded.farmerId).select('-__v');

        if (!req.farmer) {
            return res.status(401).json({
                success: false,
                message: 'Farmer not found. Token is invalid.',
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized. Token failed.',
        });
    }
};

module.exports = { protect };
