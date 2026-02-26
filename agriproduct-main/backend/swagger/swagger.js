const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: '🌾 Agri Product API',
            version: '1.0.0',
            description: `
## Agricultural Platform Backend API

A comprehensive REST API for the **Agri Product** platform supporting:
- 🔐 Farmer Authentication (OTP-based + JWT)
- 🌾 Crop Management
- 📊 Mandi Price Analytics (local, highest India, state-wise, 30-day history)
- 📈 AI Price Prediction (7-day linear regression forecast)
- 🚛 Transport Cost Simulation (Haversine-based)
- 🗺️ Nearby Market Discovery (5 nearest APMC mandis)
- 🌦️ Weather Alerts (with OpenWeather API or simulated fallback)

### Getting Started
1. Register with **POST /api/auth/register**
2. Get OTP with **POST /api/auth/send-otp** 
3. Get JWT with **POST /api/auth/verify-otp**
4. Use JWT as **Bearer token** in protected endpoints
      `,
            contact: {
                name: 'Agri Product Team',
                email: 'support@agriproduct.in',
            },
            license: { name: 'MIT' },
        },
        servers: [
            { url: 'http://localhost:5000/api', description: 'Development Server' },
            { url: 'https://agriproduct-api.onrender.com/api', description: 'Production Server (Render)' },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token (obtained from /auth/verify-otp)',
                },
            },
            schemas: {
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string' },
                        data: { type: 'object' },
                    },
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string' },
                    },
                },
            },
        },
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
