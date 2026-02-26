const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide your name'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [50, 'Name cannot exceed 50 characters'],
        },
        phone: {
            type: String,
            required: [true, 'Please provide your phone number'],
            unique: true,
            match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian mobile number'],
        },
        location: {
            state: {
                type: String,
                required: [true, 'Please provide your state'],
                trim: true,
            },
            district: {
                type: String,
                required: [true, 'Please provide your district'],
                trim: true,
            },
        },
        crops: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Crop',
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Farmer', farmerSchema);
