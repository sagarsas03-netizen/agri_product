const express = require('express');
const router = express.Router();
const { calculateTransport } = require('../controllers/transportController');

/**
 * @swagger
 * tags:
 *   name: Transport
 *   description: Transport cost simulation
 */

/**
 * @swagger
 * /transport/calculate:
 *   post:
 *     summary: Calculate transport cost and net profit
 *     tags: [Transport]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cropName, quantity, sourceLat, sourceLon, destinationMandiId]
 *             properties:
 *               cropName: { type: string, example: Wheat }
 *               quantity: { type: number, example: 100 }
 *               sourceLat: { type: number, example: 20.12 }
 *               sourceLon: { type: number, example: 74.01 }
 *               destinationMandiId: { type: string, example: up001 }
 *     responses:
 *       200:
 *         description: Distance, transport cost, commission, and net profit
 */
router.post('/calculate', calculateTransport);

module.exports = router;
