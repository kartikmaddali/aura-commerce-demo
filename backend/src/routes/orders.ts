import express from 'express';
import { body, param, query } from 'express-validator';
import { authenticateToken, requireAuth, requireRole, requireB2B } from '../middleware/auth';
import { OrderController } from '../controllers/OrderController';
import { validateRequest } from '../middleware/validation';

const router = express.Router();
const orderController = new OrderController();

// Public routes (require authentication)
router.use(authenticateToken);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get user orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by order status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of orders
 *       401:
 *         description: Authentication required
 */
router.get('/', [
  query('status').optional().isString(),
  query('page').optional().isNumeric(),
  query('limit').optional().isNumeric(),
  validateRequest,
], orderController.getOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */
router.get('/:id', [
  param('id').isString().notEmpty(),
  validateRequest,
], orderController.getOrderById);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - shippingAddress
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *               shippingAddress:
 *                 type: object
 *               billingAddress:
 *                 type: object
 *               paymentMethod:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', [
  body('items').isArray({ min: 1 }),
  body('items.*.productId').isString().notEmpty(),
  body('items.*.quantity').isInt({ min: 1 }),
  body('shippingAddress').isObject(),
  body('billingAddress').optional().isObject(),
  body('paymentMethod').optional().isString(),
  validateRequest,
], orderController.createOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update order (Admin only for B2B)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               items:
 *                 type: array
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       403:
 *         description: Admin access required for B2B
 */
router.put('/:id', [
  param('id').isString().notEmpty(),
  body('status').optional().isString(),
  body('items').optional().isArray(),
  validateRequest,
], orderController.updateOrder);

// B2B specific routes
router.use('/b2b', requireB2B);

/**
 * @swagger
 * /api/orders/b2b/organization:
 *   get:
 *     summary: Get all orders for organization (B2B Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
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
 *         description: Organization orders
 *       403:
 *         description: Admin access required
 */
router.get('/b2b/organization', [
  query('status').optional().isString(),
  query('userId').optional().isString(),
  query('page').optional().isNumeric(),
  query('limit').optional().isNumeric(),
  validateRequest,
], orderController.getOrganizationOrders);

/**
 * @swagger
 * /api/orders/b2b/{id}/approve:
 *   post:
 *     summary: Approve order (B2B Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order approved
 *       403:
 *         description: Admin access required
 */
router.post('/b2b/:id/approve', [
  param('id').isString().notEmpty(),
  validateRequest,
], orderController.approveOrder);

/**
 * @swagger
 * /api/orders/b2b/{id}/reject:
 *   post:
 *     summary: Reject order (B2B Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order rejected
 *       403:
 *         description: Admin access required
 */
router.post('/b2b/:id/reject', [
  param('id').isString().notEmpty(),
  body('reason').isString().notEmpty(),
  validateRequest,
], orderController.rejectOrder);

export default router;
