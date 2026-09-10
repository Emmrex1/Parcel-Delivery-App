import express from "express";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

import {
  getRevenueAnalytics,
  getParcelGrowth,
  getTopCities,
  getDeliveryPerformance,
  getAnalyticsSummary,
} from "../controllers/analyticsController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Analytics
 *     description: Admin dashboard analytics endpoints
 */

/**
 * @swagger
 * /api/analytics/summary:
 *   get:
 *     summary: Get  analytics statistics (admin only)
 *     description: >
 *       Returns  analytics data including parcel totals,
 *       user totals, revenue, monthly parcel growth, revenue analytics,
 *       user growth, parcel status distribution, and weight distribution.
 *       This endpoint is available to administrators only.
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Summary totals and status distribution 
 *       401:
 *         description: Unauthorized - authentication token is missing or invalid
 *       403:
 *         description: Forbidden - administrator access is required
 *       500:
 *         description: Internal server error
 */


router.get( "/summary", protect, adminOnly, getAnalyticsSummary);


/**
 * @swagger
 * /api/analytics/revenue:
 *   get:
 *     summary: Get revenue analytics (admin only)
 *     description: >
 *       Returns revenue analytics data including monthly revenue, total revenue, and revenue breakdown by category.
 *       This endpoint is available to administrators only.
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Revenue analytics data for the past 12 months retrieved successfully
 *       401:
 *         description: Unauthorized - authentication token is missing or invalid
 *       403:
 *         description: Forbidden - administrator access is required
 *       500:
 *         description: Internal server error
 */


router.get( "/revenue", protect, adminOnly, getRevenueAnalytics);

/**
 * @swagger
 * /api/analytics/parcels-growth:
 *   get:
 *     summary: Get parcel growth analytics (admin only)
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: parcel growth analytics data for the past 12 months retrieved successfully
 *       401:
 *         description: Unauthorized - authentication token is missing or invalid
 *       403:
 *         description: Forbidden - administrator access is required
 *       500:
 *         description: Internal server error
 */


router.get( "/parcels-growth", protect, adminOnly, getParcelGrowth);


/**
 * @swagger
 * /api/analytics/top-cities:
 *   get:
 *     summary: Get top cities by parcel volume (admin only)
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Top cities by parcel volume data retrieved successfully
 *       401:
 *         description: Unauthorized - authentication token is missing or invalid
 *       403:
 *         description: Forbidden - administrator access is required
 *       500:
 *         description: Internal server error
 */


router.get( "/top-cities", protect, adminOnly, getTopCities);

/**
 * @swagger
 * /api/analytics/delivery-performance:
 *   get:
 *     summary: Get delivery performance analytics (admin only)
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Delivery performance analytics data retrieved successfully
 *       401:
 *         description: Unauthorized - authentication token is missing or invalid
 *       403:
 *         description: Forbidden - administrator access is required
 *       500:
 *         description: Internal server error
 */


router.get( "/delivery-performance", protect, adminOnly, getDeliveryPerformance);





export default router;