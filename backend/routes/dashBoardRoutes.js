import express from "express";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

import {
  getDashboardStats,
  // getRevenueAnalytics,
  // getParcelGrowth,
  // getTopCities,
  // getDeliveryPerformance,
  // getAnalyticsSummary,
} from "../controllers/analyticsController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Dashboard
 *     description: Admin dashboard analytics endpoints
 */

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard analytics statistics (admin only)
 *     description: >
 *       Returns dashboard analytics data including parcel totals,
 *       user totals, revenue, monthly parcel growth, revenue analytics,
 *       user growth, parcel status distribution, and weight distribution.
 *       This endpoint is available to administrators only.
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *       401:
 *         description: Unauthorized - authentication token is missing or invalid
 *       403:
 *         description: Forbidden - administrator access is required
 *       500:
 *         description: Internal server error
 */

router.get(
  "/stats",
  protect,
  adminOnly,
  getDashboardStats
);

// Incase for future reference, here are the other routes that were commented out in the recent edits incase of using only postman or other testing tools to test the endpoints. The routes are still available in the analyticsController.js file and can be uncommented if needed.:

// router.get(
//   "/revenue",
//   protect,
//   adminOnly,
//   getRevenueAnalytics
// );

// router.get(
//   "/parcel-growth",
//   protect,
//   adminOnly,
//   getParcelGrowth
// );

// router.get(
//   "/top-cities",
//   protect,
//   adminOnly,
//   getTopCities
// );

// router.get(
//   "/delivery-performance",
//   protect,
//   adminOnly,
//   getDeliveryPerformance
// );

// router.get(
//   "/summary",
//   protect,
//   adminOnly,
//   getAnalyticsSummary
// );

export default router;