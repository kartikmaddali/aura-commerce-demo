import express from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/auth';
import { AIController } from '../controllers/AIController';
import { validateRequest } from '../middleware/validation';

const router = express.Router();
const aiController = new AIController();

/**
 * @swagger
 * /api/ai/chat:
 *   post:
 *     summary: Send message to AI assistant
 *     tags: [AI Assistant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *               context:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: string
 *                   orderId:
 *                     type: string
 *     responses:
 *       200:
 *         description: AI response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     response:
 *                       type: string
 *                     context:
 *                       type: object
 *       401:
 *         description: Authentication required
 */
router.post('/chat', [
  body('message').isString().notEmpty(),
  body('context').optional().isObject(),
  validateRequest,
], aiController.chat);

/**
 * @swagger
 * /api/ai/context:
 *   get:
 *     summary: Get AI context for current user
 *     tags: [AI Assistant]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: AI context
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                     recentOrders:
 *                       type: array
 *                     wishlist:
 *                       type: array
 *                     organization:
 *                       type: object
 *       401:
 *         description: Authentication required
 */
router.get('/context', aiController.getContext);

/**
 * @swagger
 * /api/ai/recommendations:
 *   get:
 *     summary: Get AI-powered product recommendations
 *     tags: [AI Assistant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Product category
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of recommendations
 *     responses:
 *       200:
 *         description: Product recommendations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Authentication required
 */
router.get('/recommendations', aiController.getRecommendations);

export default router;
