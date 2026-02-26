const mongoose = require('mongoose');

const transportRequestSchema = new mongoose.Schema(
    {
        farmerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Farmer',
        },
        cropName: { type: String, required: true },
        quantity: { type: Number, required: true },
        source: {
            lat: Number,
            lon: Number,
            name: String,
        },
        destination: {
            mandiId: String,
            mandiName: String,
            lat: Number,
            lon: Number,
            state: String,
        },
        distance: Number,
        transportCost: Number,
        commission: Number,
        commissionRate: Number,
        highestPrice: Number,
        netProfit: Number,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('TransportRequest', transportRequestSchema);
