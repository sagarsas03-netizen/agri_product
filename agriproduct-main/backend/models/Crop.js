const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema(
    {
        cropName: {
            type: String,
            required: [true, 'Please provide the crop name'],
            trim: true,
        },
        quantity: {
            type: Number,
            required: [true, 'Please provide the quantity'],
            min: [0, 'Quantity cannot be negative'],
        },
        unit: {
            type: String,
            default: 'kg',
            enum: ['kg', 'quintal', 'ton'],
        },
        farmerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Farmer',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Crop', cropSchema);
