const express = require('express');
const router = express.Router();
const { addCrop, getMyCrops, updateCrop, removeCrop } = require('../controllers/cropController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Crops
 *   description: Farmer crop management
 */

/**
 * @swagger
 * /crops:
 *   post:
 *     summary: Add a crop to your profile (auto-fetches mandi price)
 *     tags: [Crops]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cropName, quantity]
 *             properties:
 *               cropName: { type: string, example: Wheat }
 *               quantity: { type: number, example: 500 }
 *               unit: { type: string, enum: [kg, quintal, ton], example: quintal }
 *     responses:
 *       201: { description: Crop added with latest mandi price }
 *       401: { description: Unauthorized }
 */
router.post('/', protect, addCrop);

/**
 * @swagger
 * /crops:
 *   get:
 *     summary: Get all crops for the logged-in farmer
 *     tags: [Crops]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: List of crops with latest prices }
 */
router.get('/', protect, getMyCrops);

/**
 * @swagger
 * /crops/{id}:
 *   put:
 *     summary: Update crop quantity
 *     tags: [Crops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity: { type: number, example: 300 }
 *               unit: { type: string, example: quintal }
 *     responses:
 *       200: { description: Crop updated }
 *       404: { description: Crop not found }
 */
router.put('/:id', protect, updateCrop);

/**
 * @swagger
 * /crops/{id}:
 *   delete:
 *     summary: Remove a crop from your profile
 *     tags: [Crops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Crop removed }
 *       404: { description: Crop not found }
 */
router.delete('/:id', protect, removeCrop);

module.exports = router;
