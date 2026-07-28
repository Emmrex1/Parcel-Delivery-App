import express from "express";
import { addUser, login } from "../controllers/authController.js";
import { authLimiter } from "../middleware/ratelimiter.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication and user management
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: admin login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Successful login, returns a JWT token and user information
 *       400:
 *         description: Bad request, validation error
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", authLimiter, login);

/**
 * @swagger
 * /api/auth/adduser:
 *   post:
 *     summary: Add a new user (admin only)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error or user already exists
 *       401:
 *         description: Not authorized, no token or user not found
 *       403:
 *         description: Forbidden, user is not an admin
 */
router.post("/adduser",  protect, adminOnly, addUser);


export default router;