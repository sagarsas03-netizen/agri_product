/**
 * Price seed data generator
 * Generates realistic mandi price records for 10 crops × 15 states × 30 days
 */

const crops = [
    { name: 'Wheat', basePricePerQuintal: 2100 },
    { name: 'Rice', basePricePerQuintal: 2600 },
    { name: 'Maize', basePricePerQuintal: 1800 },
    { name: 'Cotton', basePricePerQuintal: 6200 },
    { name: 'Soybean', basePricePerQuintal: 4100 },
    { name: 'Onion', basePricePerQuintal: 1500 },
    { name: 'Tomato', basePricePerQuintal: 2200 },
    { name: 'Potato', basePricePerQuintal: 1200 },
    { name: 'Sugarcane', basePricePerQuintal: 340 },
    { name: 'Turmeric', basePricePerQuintal: 8500 },
    { name: 'Chilli', basePricePerQuintal: 9000 },
    { name: 'Groundnut', basePricePerQuintal: 5200 },
];

const stateMandiMap = [
    { state: 'Maharashtra', mandis: ['Lasalgaon APMC', 'Pune APMC', 'Nagpur APMC', 'Aurangabad APMC'] },
    { state: 'Uttar Pradesh', mandis: ['Kanpur APMC', 'Lucknow APMC', 'Agra Mandi', 'Varanasi APMC'] },
    { state: 'Punjab', mandis: ['Khanna Mandi', 'Ludhiana Grain Market', 'Amritsar APMC'] },
    { state: 'Rajasthan', mandis: ['Jaipur APMC', 'Jodhpur Mandi', 'Kota Mandi'] },
    { state: 'Madhya Pradesh', mandis: ['Indore APMC', 'Bhopal APMC', 'Jabalpur Mandi'] },
    { state: 'Haryana', mandis: ['Karnal Mandi', 'Sirsa APMC', 'Hisar Grain Market'] },
    { state: 'Andhra Pradesh', mandis: ['Kurnool APMC', 'Guntur Market', 'Vijayawada APMC'] },
    { state: 'Tamil Nadu', mandis: ['Chennai APMC', 'Coimbatore Mandi', 'Madurai APMC'] },
    { state: 'Gujarat', mandis: ['Ahmedabad APMC', 'Surat APMC', 'Rajkot Mandi'] },
    { state: 'Karnataka', mandis: ['Bengaluru APMC', 'Hubli APMC', 'Mysuru Mandi'] },
    { state: 'West Bengal', mandis: ['Kolkata Koley Market', 'Siliguri APMC'] },
    { state: 'Bihar', mandis: ['Patna APMC', 'Muzaffarpur Mandi'] },
    { state: 'Telangana', mandis: ['Hyderabad APMC', 'Warangal Mandi'] },
    { state: 'Odisha', mandis: ['Bhubaneswar APMC'] },
    { state: 'Chhattisgarh', mandis: ['Raipur APMC'] },
];

const generatePriceRecords = () => {
    const records = [];
    const today = new Date('2026-02-24');

    for (const crop of crops) {
        for (const { state, mandis } of stateMandiMap) {
            // State-level price variation (±20%)
            const stateMultiplier = 0.85 + Math.random() * 0.30;

            for (const mandiName of mandis) {
                // Mandi-level variation (±8%)
                const mandiMultiplier = 0.96 + Math.random() * 0.08;

                for (let day = 0; day < 30; day++) {
                    const date = new Date(today);
                    date.setDate(today.getDate() - day);

                    // Daily random walk
                    const dailyVariation = 0.95 + Math.random() * 0.10;
                    const price = Math.round(
                        crop.basePricePerQuintal * stateMultiplier * mandiMultiplier * dailyVariation
                    );

                    records.push({
                        cropName: crop.name,
                        state,
                        mandiName,
                        price,
                        unit: 'quintal',
                        date,
                    });
                }
            }
        }
    }

    return records;
};

module.exports = { generatePriceRecords };
