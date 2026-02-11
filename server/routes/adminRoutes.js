const express = require('express');
const router = express.Router();
const { createService, updateService, deleteService, getAdminBookings } = require('../controllers/adminController');
const verifyToken = require('../middleware/auth');
const authorize = require('../middleware/role');
const validate = require('../middleware/validate');
const { createServiceSchema, updateServiceSchema } = require('../validators/serviceValidator');
const { upload } = require('../config/cloudinary');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only endpoints
 */

/**
 * @swagger
 * /admin/services:
 *   post:
 *     summary: Create a new service (admin only)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, category, pricePerDay, description, availabilityDates, contactDetails, location]
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [venue, hotel, caterer, cameraman, dj, decorator, other]
 *               pricePerDay:
 *                 type: number
 *               description:
 *                 type: string
 *               availabilityDates:
 *                 type: string
 *                 description: JSON stringified array of date strings
 *               contactDetails:
 *                 type: string
 *               location:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Service created
 *       400:
 *         description: Validation error
 */
router.post(
    '/services',
    verifyToken,
    authorize('admin'),
    upload.array('images', 5),
    validate(createServiceSchema),
    createService
);

/**
 * @swagger
 * /admin/services/{id}:
 *   put:
 *     summary: Update a service (admin only, own services)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               pricePerDay:
 *                 type: number
 *               description:
 *                 type: string
 *               availabilityDates:
 *                 type: string
 *               contactDetails:
 *                 type: string
 *               location:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Service updated
 *       404:
 *         description: Service not found
 */
router.put(
    '/services/:id',
    verifyToken,
    authorize('admin'),
    upload.array('images', 5),
    validate(updateServiceSchema),
    updateService
);

/**
 * @swagger
 * /admin/services/{id}:
 *   delete:
 *     summary: Delete a service and its bookings (admin only, own services)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service deleted
 *       404:
 *         description: Service not found
 */
router.delete('/services/:id', verifyToken, authorize('admin'), deleteService);

/**
 * @swagger
 * /admin/bookings:
 *   get:
 *     summary: Get all bookings for admin's services
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings for admin's services
 */
router.get('/bookings', verifyToken, authorize('admin'), getAdminBookings);

module.exports = router;
