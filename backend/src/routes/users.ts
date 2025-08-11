import express from 'express';
import { body, param, query } from 'express-validator';
import { authenticateToken, requireAuth, requireRole, requireB2B } from '../middleware/auth';
import { UserController } from '../controllers/UserController';
import { validateRequest } from '../middleware/validation';

const router = express.Router();
const userController = new UserController();

// All routes require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Authentication required
 */
router.get('/profile', userController.getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update current user profile
 *     tags: [Users]
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
], userController.updateProfile);

// B2B specific routes
router.use('/b2b', requireB2B);

/**
 * @swagger
 * /api/users/b2b/organization:
 *   get:
 *     summary: Get all users in organization (B2B Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter by role
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Organization users
 *       403:
 *         description: Admin access required
 */
router.get('/b2b/organization', [
  query('role').optional().isString(),
  query('page').optional().isNumeric(),
  query('limit').optional().isNumeric(),
  validateRequest,
], userController.getOrganizationUsers);

/**
 * @swagger
 * /api/users/b2b:
 *   post:
 *     summary: Create new user in organization (B2B Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - firstName
 *               - lastName
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [buyer, admin]
 *     responses:
 *       201:
 *         description: User created successfully
 *       403:
 *         description: Admin access required
 */
router.post('/b2b', [
  body('email').isEmail(),
  body('firstName').isString().notEmpty(),
  body('lastName').isString().notEmpty(),
  body('role').isIn(['buyer', 'admin']),
  validateRequest,
], userController.createOrganizationUser);

/**
 * @swagger
 * /api/users/b2b/{id}:
 *   put:
 *     summary: Update user in organization (B2B Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
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
 *               role:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated successfully
 *       403:
 *         description: Admin access required
 */
router.put('/b2b/:id', [
  param('id').isString().notEmpty(),
  body('firstName').optional().isString().notEmpty(),
  body('lastName').optional().isString().notEmpty(),
  body('role').optional().isIn(['buyer', 'admin']),
  body('isActive').optional().isBoolean(),
  validateRequest,
], userController.updateOrganizationUser);

/**
 * @swagger
 * /api/users/b2b/{id}:
 *   delete:
 *     summary: Deactivate user in organization (B2B Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deactivated successfully
 *       403:
 *         description: Admin access required
 */
router.delete('/b2b/:id', [
  param('id').isString().notEmpty(),
  validateRequest,
], userController.deactivateOrganizationUser);

export default router;
