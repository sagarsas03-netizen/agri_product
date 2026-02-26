const express = require('express');
const router = express.Router();
const { register, sendOtp, verifyOtp, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Farmer authentication endpoints
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new farmer
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, phone, state, district]
 *             properties:
 *               name: { type: string, example: Ramesh Kumar }
 *               phone: { type: string, example: "9876543210" }
 *               state: { type: string, example: Maharashtra }
 *               district: { type: string, example: Nashik }
 *     responses:
 *       201: { description: Farmer registered successfully }
 *       400: { description: Validation error or duplicate phone }
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/send-otp:
 *   post:
 *     summary: Send OTP to farmer's phone (simulated)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone]
 *             properties:
 *               phone: { type: string, example: "9876543210" }
 *     responses:
 *       200: { description: OTP sent (returned in dev mode) }
 *       404: { description: Farmer not found }
 */
router.post('/send-otp', sendOtp);

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP and receive JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone, otp]
 *             properties:
 *               phone: { type: string, example: "9876543210" }
 *               otp: { type: string, example: "123456" }
 *     responses:
 *       200: { description: Login successful, returns JWT }
 *       401: { description: Invalid or expired OTP }
 */
router.post('/verify-otp', verifyOtp);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get logged-in farmer profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Farmer profile }
 *       401: { description: Unauthorized }
 */
router.get('/me', protect, getMe);

module.exports = router;
