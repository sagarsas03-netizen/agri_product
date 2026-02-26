const express = require('express');
const router = express.Router();
const { getLocalPrice, getHighestPrice, getHighestPerState, getPriceHistory } = require('../controllers/priceController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Prices
 *   description: Mandi price analytics
 */

/**
 * @swagger
 * /prices/local:
 *   get:
 *     summary: Get local mandi price for farmer's state
 *     tags: [Prices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cropName
 *         required: true
 *         schema: { type: string, example: Wheat }
 *     responses:
 *       200: { description: Local mandi prices }
 */
router.get('/local', protect, getLocalPrice);

/**
 * @swagger
 * /prices/highest:
 *   get:
 *     summary: Get highest price across India for a crop
 *     tags: [Prices]
 *     parameters:
 *       - in: query
 *         name: cropName
 *         required: true
 *         schema: { type: string, example: Wheat }
 *     responses:
 *       200: { description: Highest price in India }
 */
router.get('/highest', getHighestPrice);

/**
 * @swagger
 * /prices/highest-states:
 *   get:
 *     summary: Get highest price in each state for a crop
 *     tags: [Prices]
 *     parameters:
 *       - in: query
 *         name: cropName
 *         required: true
 *         schema: { type: string, example: Wheat }
 *     responses:
 *       200: { description: State-wise highest prices }
 */
router.get('/highest-states', getHighestPerState);

/**
 * @swagger
 * /prices/history/{cropName}:
 *   get:
 *     summary: Get price history for last 30 days
 *     tags: [Prices]
 *     parameters:
 *       - in: path
 *         name: cropName
 *         required: true
 *         schema: { type: string, example: Wheat }
 *       - in: query
 *         name: state
 *         schema: { type: string, example: Maharashtra }
 *     responses:
 *       200: { description: Daily price history with avg/min/max }
 */
router.get('/history/:cropName', getPriceHistory);

module.exports = router;
