import express from "express";
import { addCheckpoint, createParcel, getParcelByTrackingNumber } from "../controllers/parcelController.js";
import { authLimiter } from "../middleware/ratelimiter.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Parcel
 *     description: Parcel management and tracking
    */

/**
 * @swagger
 * /api/parcels:
 *   post:
 *     summary: Create a new parcel(admin)
 *     description: Creates a new parcel, generates a tracking number, calculates the delivery price, and creates the initial parcel checkpoint.
 *     tags:
 *       - Parcels
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - senderName
 *               - senderPhone
 *               - senderAddress
 *               - receiverName
 *               - receiverPhone
 *               - receiverAddress
 *               - shipmentType
 *               - originCity
 *               - destinationCity
 *               - deliveryType
 *               - parcelCategory
 *               - weight
 *
 *             properties:
 *               senderName:
 *                 type: string
 *                 example: Ali Ahmed
 *
 *               senderPhone:
 *                 type: string
 *                 example: "+2348012345678"
 *
 *               senderAddress:
 *                 type: string
 *                 example: "12 Marina Road, Lagos"
 *
 *               receiverName:
 *                 type: string
 *                 example: Zain Khan
 *
 *               receiverPhone:
 *                 type: string
 *                 example: "+2348098765432"
 *
 *               receiverAddress:
 *                 type: string
 *                 example: "25 Airport Road, Abuja"
 *
 *               shipmentType:
 *                 type: string
 *                 enum:
 *                   - national
 *                   - international
 *                 example: national
 *
 *               originCity:
 *                 type: string
 *                 example: Lagos
 *
 *               destinationCity:
 *                 type: string
 *                 example: Abuja
 *
 *               deliveryType:
 *                 type: string
 *                 enum:
 *                   - sameday
 *                   - overnight
 *                   - standard
 *                 example: overnight
 *
 *               parcelCategory:
 *                 type: string
 *                 enum:
 *                   - document
 *                   - electronics
 *                   - clothing
 *                   - fragile
 *                   - food
 *                   - cosmetics
 *                   - medicine
 *                   - books
 *                   - small_package
 *                   - large_package
 *                 example: electronics
 *
 *               weight:
 *                 type: number
 *                 minimum: 0
 *                 example: 3.5
 *
 *     responses:
 *       201:
 *         description: Parcel created successfully
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Not authorized
 *
 *       500:
 *         description: Server error
 */
router.post("/", protect, adminOnly, createParcel);

/**
 * @swagger
 * /api/parcels/tracking/{trackingNumber}:
 *   get:
 *     summary: Get parcel by tracking number
 *     description: Retrieves a parcel and its tracking checkpoints using the parcel tracking number.
 *     tags: [Parcels]
 *
 *     parameters:
 *       - in: path
 *         name: trackingNumber
 *         required: true
 *         description: The unique tracking number of the parcel.
 *         schema:
 *           type: string
 *         example: PKG-123456789
 *
 *     responses:
 *       200:
 *         description: Parcel retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Parcel retrieved successfully
 *                 parcel:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 665f2a8c1234567890abcdef
 *
 *                     trackingNumber:
 *                       type: string
 *                       example: PKG-123456789
 *
 *                     senderName:
 *                       type: string
 *                       example: Ali Ahmed
 *
 *                     senderPhone:
 *                       type: string
 *                       example: "+2348012345678"
 *
 *                     senderAddress:
 *                       type: string
 *                       example: "12 Marina Road, Lagos"
 *
 *                     receiverName:
 *                       type: string
 *                       example: Zain Khan
 *
 *                     receiverPhone:
 *                       type: string
 *                       example: "+2348098765432"
 *
 *                     receiverAddress:
 *                       type: string
 *                       example: "25 Airport Road, Abuja"
 *
 *                     shipmentType:
 *                       type: string
 *                       enum:
 *                         - national
 *                         - international
 *                       example: national
 *
 *                     originCity:
 *                       type: string
 *                       example: Lagos
 *
 *                     destinationCity:
 *                       type: string
 *                       example: Abuja
 *
 *                     deliveryType:
 *                       type: string
 *                       enum:
 *                         - sameday
 *                         - overnight
 *                         - standard
 *                       example: overnight
 *
 *                     parcelCategory:
 *                       type: string
 *                       enum:
 *                         - document
 *                         - electronics
 *                         - clothing
 *                         - fragile
 *                         - food
 *                         - cosmetics
 *                         - medicine
 *                         - books
 *                         - small_package
 *                         - large_package
 *                       example: electronics
 *
 *                     weight:
 *                       type: number
 *                       minimum: 0
 *                       example: 3.5
 *
 *                     price:
 *                       type: number
 *                       example: 2050
 *
 *                     checkpoints:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           location:
 *                             type: string
 *                             example: Lagos
 *
 *                           title:
 *                             type: string
 *                             example: Parcel arrived at Lagos Branch
 *
 *                           description:
 *                             type: string
 *                             example: Parcel has been received at Lagos Branch and is ready for shipment.
 *
 *                           status:
 *                             type: string
 *                             enum:
 *                               - arrived
 *                               - in_transit
 *                               - out_for_delivery
 *                               - delivered
 *                             example: arrived
 *
 *                           timestamps:
 *                             type: string
 *                             format: date-time
 *                             example: 2026-08-18T10:30:00.000Z
 *
 *                           updatedBy:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: 665f2a8c1234567890abcdef
 *                               name:
 *                                 type: string
 *                                 example: Admin
 *                               email:
 *                                 type: string
 *                                 example: admin@example.com
 *
 *       404:
 *         description: Parcel not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Parcel not found
 *
 *       500:
 *         description: Internal server error
 */
router.get("/tracking/:trackingNumber",protect,adminOnly, getParcelByTrackingNumber);

/**
 * @swagger
 * /api/parcels/{id}/checkpoint:
 *   post:
 *     summary: Add a new checkpoint to a parcel
 *     description: Adds a new tracking checkpoint to an existing parcel. This endpoint is restricted to administrators.
 *     tags: [Parcels]
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The MongoDB ID of the parcel
 *         schema:
 *           type: string
 *         example: 665f2a8c1234567890abcdef
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - location
 *               - title
 *               - status
 *             properties:
 *               location:
 *                 type: string
 *                 description: Current location of the parcel
 *                 example: Abuja
 *
 *               title:
 *                 type: string
 *                 description: Title of the checkpoint
 *                 example: Parcel arrived at Abuja Branch
 *
 *               description:
 *                 type: string
 *                 description: Additional information about the checkpoint
 *                 example: Parcel has arrived at the Abuja branch and is ready for delivery.
 *
 *               status:
 *                 type: string
 *                 description: Current status of the parcel
 *                 enum:
 *                   - arrived
 *                   - in_transit
 *                   - out_for_delivery
 *                   - delivered
 *                 example: in_transit
 *
 *     responses:
 *       201:
 *         description: Checkpoint added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Checkpoint added successfully
 *                 parcel:
 *                   type: object
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Not authorized, no token or invalid token
 *
 *       403:
 *         description: Forbidden, user is not an admin
 *
 *       404:
 *         description: Parcel not found
 *
 *       500:
 *         description: Internal server error
 */
router.post("/:id/checkpoint", protect, adminOnly, addCheckpoint);

/**
 * @swagger
 * /api/parcels:
 *   get:
 *     summary: Get all parcels
 *     description: Retrieve all parcels with pagination, status filtering, and tracking number search.
 *     tags:
 *       - Parcels
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number
 *
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *         description: Number of parcels to return per page
 *
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           example: In Transit
 *         description: Filter parcels by status
 *
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *           example: TRK123456
 *         description: Search parcels by tracking number
 *
 *     responses:
 *       200:
 *         description: Parcels retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Parcel'
 *                 total:
 *                   type: integer
 *                   example: 25
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 3
 *
 *       400:
 *         description: Invalid query parameters
 *
 *       500:
 *         description: Internal server error
 */





export default router;
 
