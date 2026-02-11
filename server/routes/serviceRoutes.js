const express = require('express');
const router = express.Router();
const { getServices, getServiceById } = require('../controllers/serviceController');

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Public service endpoints
 */

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Get all services with filtering, search, pagination, and sorting
 *     tags: [Services]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search in title and description
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [venue, hotel, caterer, cameraman, dj, decorator, other]
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: ISO date to check availability
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: -createdAt
 *         description: Comma-separated sort fields (e.g. pricePerDay,-createdAt)
 *     responses:
 *       200:
 *         description: List of services
 */
router.get('/', getServices);

/**
 * @swagger
 * /services/{id}:
 *   get:
 *     summary: Get a single service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service details
 *       404:
 *         description: Service not found
 */
router.get('/:id', getServiceById);

module.exports = router;
