const express = require('express');
const router = express.Router();
const { getNearbyMandis, getAllMandis } = require('../controllers/mandiController');

/**
 * @swagger
 * tags:
 *   name: Mandis
 *   description: Mandi discovery and nearby market finder
 */

/**
 * @swagger
 * /mandis/nearby:
 *   get:
 *     summary: Get 5 nearest mandis to a location with crop price
 *     tags: [Mandis]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema: { type: number, example: 20.12 }
 *       - in: query
 *         name: lon
 *         required: true
 *         schema: { type: number, example: 73.70 }
 *       - in: query
 *         name: cropName
 *         schema: { type: string, example: Wheat }
 *     responses:
 *       200:
 *         description: 5 nearest mandis sorted by distance
 */
router.get('/nearby', getNearbyMandis);

/**
 * @swagger
 * /mandis:
 *   get:
 *     summary: Get all available mandis (50 across India)
 *     tags: [Mandis]
 *     responses:
 *       200: { description: Full mandi list }
 */
router.get('/', getAllMandis);

module.exports = router;
