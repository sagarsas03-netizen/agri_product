require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Price = require('../models/Price');
const { generatePriceRecords } = require('../data/prices');

const seedDB = async () => {
    try {
        await connectDB();
        console.log('🌱 Starting database seeding...');

        // Clear existing price data
        await Price.deleteMany({});
        console.log('🗑️  Cleared existing price data');

        // Generate and insert price records
        const records = generatePriceRecords();
        console.log(`📊 Inserting ${records.length} price records...`);

        // Batch insert in chunks of 500
        const chunkSize = 500;
        for (let i = 0; i < records.length; i += chunkSize) {
            const chunk = records.slice(i, i + chunkSize);
            await Price.insertMany(chunk);
            process.stdout.write(`\r   Inserted ${Math.min(i + chunkSize, records.length)}/${records.length}`);
        }

        console.log('\n✅ Seeding complete!');
        console.log(`   Total price records: ${records.length}`);
        console.log('   Crops:', [...new Set(records.map((r) => r.cropName))].join(', '));
        console.log('   States:', [...new Set(records.map((r) => r.state))].length);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    }
};

seedDB();
