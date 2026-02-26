const express = require('express');
const router = express.Router();
const { getWeatherData } = require('../controllers/weatherController');

/**
 * @swagger
 * tags:
 *   name: Weather
 *   description: Weather data and agricultural alerts
 */

/**
 * @swagger
 * /weather/{location}:
 *   get:
 *     summary: Get current weather and 3-day forecast for a location
 *     tags: [Weather]
 *     parameters:
 *       - in: path
 *         name: location
 *         required: true
 *         schema: { type: string, example: Nashik }
 *     responses:
 *       200:
 *         description: Current weather, 3-day forecast, and alert flag
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 temperature: { type: number }
 *                 humidity: { type: number }
 *                 condition: { type: string }
 *                 alert: { type: boolean }
 *                 alertMessage: { type: string }
 *                 forecast: { type: array }
 */
router.get('/:location', getWeatherData);

module.exports = router;
