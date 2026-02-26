require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB then start server
const startServer = async () => {
    await connectDB();

    const server = app.listen(PORT, () => {
        console.log('');
        console.log('🌾 ─────────────────────────────────────────');
        console.log(`   Agri Product API Server`);
        console.log(`   Running on: http://localhost:${PORT}`);
        console.log(`   API Docs:   http://localhost:${PORT}/api/docs`);
        console.log(`   Health:     http://localhost:${PORT}/api/health`);
        console.log(`   Env:        ${process.env.NODE_ENV}`);
        console.log('🌾 ─────────────────────────────────────────');
        console.log('');
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
        console.log('SIGTERM received. Shutting down gracefully...');
        server.close(() => {
            console.log('Server closed.');
            process.exit(0);
        });
    });

    process.on('unhandledRejection', (err) => {
        console.error('Unhandled Rejection:', err.message);
        server.close(() => process.exit(1));
    });
};

startServer();
