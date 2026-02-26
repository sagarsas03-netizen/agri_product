const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const cropRoutes = require('./routes/cropRoutes');
const priceRoutes = require('./routes/priceRoutes');
const predictRoutes = require('./routes/predictRoutes');
const transportRoutes = require('./routes/transportRoutes');
const mandiRoutes = require('./routes/mandiRoutes');
const weatherRoutes = require('./routes/weatherRoutes');

const app = express();

// ─── CORS ──────────────────────────────────────────────────────────────────
app.use(
    cors({
        origin: '*', // Restrict to your frontend URL in production
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// ─── Body Parser ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── API Docs ──────────────────────────────────────────────────────────────
app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        customSiteTitle: '🌾 Agri Product API Docs',
        customCss: `.swagger-ui .topbar { background-color: #1a7f37; } .swagger-ui .topbar-wrapper img { display: none; } .swagger-ui .topbar-wrapper::before { content: '🌾 Agri Product API'; color: white; font-size: 1.5rem; font-weight: bold; padding: 0.5rem; }`,
        swaggerOptions: { persistAuthorization: true },
    })
);

// ─── Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/predict-price', predictRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/mandis', mandiRoutes);
app.use('/api/weather', weatherRoutes);

// ─── Health Check ──────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: '🌾 Agri Product API is running!',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
            docs: '/api/docs',
            auth: '/api/auth',
            crops: '/api/crops',
            prices: '/api/prices',
            prediction: '/api/predict-price/:cropName',
            transport: '/api/transport/calculate',
            mandis: '/api/mandis/nearby',
            weather: '/api/weather/:location',
        },
    });
});

// ─── 404 Handler ───────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found. Visit /api/docs for documentation.`,
    });
});

// ─── Centralized Error Handler ─────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
