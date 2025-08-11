import express from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/AuthController';
import { validateRequest } from '../middleware/validation';

const router = express.Router();
const authController = new AuthController();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
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
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', [
  body('email').isEmail(),
  body('password').isString().isLength({ min: 6 }),
  validateRequest,
], authController.login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: User registration
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               brand:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Validation error
 */
router.post('/register', [
  body('email').isEmail(),
  body('password').isString().isLength({ min: 6 }),
  body('firstName').isString().notEmpty(),
  body('lastName').isString().notEmpty(),
  body('brand').optional().isIn(['luxeloom', 'urbanmarket', 'aura-wholesale']),
  validateRequest,
], authController.register);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid refresh token
 */
router.post('/refresh', [
  body('refreshToken').isString().notEmpty(),
  validateRequest,
], authController.refreshToken);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', authController.logout);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Authentication required
 */
router.get('/profile', authController.getProfile);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Authentication required
 */
router.put('/profile', [
  body('firstName').optional().isString().notEmpty(),
  body('lastName').optional().isString().notEmpty(),
  body('email').optional().isEmail(),
  validateRequest,
], authController.updateProfile);

/**
 * @swagger
 * /api/auth/link-account:
 *   post:
 *     summary: Link social account
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - provider
 *             properties:
 *               provider:
 *                 type: string
 *                 enum: [google, apple, facebook]
 *     responses:
 *       200:
 *         description: Account linked successfully
 *       401:
 *         description: Authentication required
 */
router.post('/link-account', [
  body('provider').isIn(['google', 'apple', 'facebook']),
  validateRequest,
], authController.linkAccount);

/**
 * @swagger
 * /api/auth/magic-link:
 *   post:
 *     summary: Send magic link for passwordless login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Magic link sent successfully
 */
router.post('/magic-link', [
  body('email').isEmail(),
  validateRequest,
], authController.sendMagicLink);

export default router;
