const express = require('express');
const router = express.Router();
const { predictPrice } = require('../controllers/predictController');

/**
 * @swagger
 * tags:
 *   name: Prediction
 *   description: AI price prediction (linear regression simulation)
 */

/**
 * @swagger
 * /predict-price/{cropName}:
 *   get:
 *     summary: Predict next 7-day mandi prices for a crop
 *     tags: [Prediction]
 *     parameters:
 *       - in: path
 *         name: cropName
 *         required: true
 *         schema: { type: string, example: Wheat }
 *     responses:
 *       200:
 *         description: 7-day price forecast with confidence scores
 */
router.get('/:cropName', predictPrice);

module.exports = router;
