const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema(
    {
        cropName: {
            type: String,
            required: [true, 'Crop name is required'],
            trim: true,
        },
        state: {
            type: String,
            required: [true, 'State is required'],
            trim: true,
        },
        mandiName: {
            type: String,
            required: [true, 'Mandi name is required'],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        unit: {
            type: String,
            default: 'quintal',
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for efficient querying
priceSchema.index({ cropName: 1, state: 1, date: -1 });
priceSchema.index({ cropName: 1, date: -1 });

module.exports = mongoose.model('Price', priceSchema);
