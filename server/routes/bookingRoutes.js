const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, cancelBooking } = require('../controllers/bookingController');
const verifyToken = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createBookingSchema } = require('../validators/bookingValidator');

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: User booking endpoints
 */

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [serviceId, startDate, endDate]
 *             properties:
 *               serviceId:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Booking created
 *       400:
 *         description: Validation error or dates not available
 *       404:
 *         description: Service not found
 */
router.post('/', verifyToken, validate(createBookingSchema), createBooking);

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings for current user
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of user bookings
 */
router.get('/', verifyToken, getMyBookings);

/**
 * @swagger
 * /bookings/{id}/cancel:
 *   patch:
 *     summary: Cancel a booking
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking cancelled
 *       400:
 *         description: Booking already cancelled
 *       404:
 *         description: Booking not found
 */
router.patch('/:id/cancel', verifyToken, cancelBooking);

module.exports = router;
