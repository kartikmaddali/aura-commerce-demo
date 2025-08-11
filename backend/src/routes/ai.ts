import express from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/auth';
import { AIController } from '../controllers/AIController';
import { validateRequest } from '../middleware/validation';

const router = express.Router();
const aiController = new AIController();

// 1. USER AUTHENTICATION FOR AI AGENTS
/**
 * @swagger
 * /api/ai/authenticate-agent:
 *   post:
 *     summary: Authenticate AI agent for user identification
 *     tags: [AI Assistant - Auth0 AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - agentId
 *               - agentType
 *               - userId
 *               - action
 *             properties:
 *               agentId:
 *                 type: string
 *                 description: Unique identifier for the AI agent
 *               agentType:
 *                 type: string
 *                 enum: [chatbot, background-worker, recommendation-engine]
 *                 description: Type of AI agent
 *               userId:
 *                 type: string
 *                 description: User ID to authenticate for
 *               action:
 *                 type: string
 *                 description: Action the agent wants to perform
 *     responses:
 *       200:
 *         description: AI agent authenticated successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Authentication required
 */
router.post('/authenticate-agent', [
  body('agentId').isString().notEmpty(),
  body('agentType').isIn(['chatbot', 'background-worker', 'recommendation-engine']),
  body('userId').isString().notEmpty(),
  body('action').isString().notEmpty(),
  validateRequest,
], aiController.authenticateAIAgent);

// 2. TOKEN VAULT ENDPOINTS
/**
 * @swagger
 * /api/ai/tokens:
 *   post:
 *     summary: Store API token securely in Auth0 Token Vault
 *     tags: [AI Assistant - Token Vault]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tokenType
 *               - tokenValue
 *             properties:
 *               tokenType:
 *                 type: string
 *                 enum: [google, github, openai, stripe]
 *                 description: Type of API token
 *               tokenValue:
 *                 type: string
 *                 description: The token value to store
 *               metadata:
 *                 type: object
 *                 description: Additional metadata for the token
 *     responses:
 *       200:
 *         description: Token stored successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Authentication required
 */
router.post('/tokens', [
  body('tokenType').isIn(['google', 'github', 'openai', 'stripe']),
  body('tokenValue').isString().notEmpty(),
  body('metadata').optional().isObject(),
  validateRequest,
], aiController.storeToken);

/**
 * @swagger
 * /api/ai/tokens/{tokenType}:
 *   get:
 *     summary: Retrieve API token from Auth0 Token Vault
 *     tags: [AI Assistant - Token Vault]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tokenType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [google, github, openai, stripe]
 *         description: Type of token to retrieve
 *     responses:
 *       200:
 *         description: Token retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get('/tokens/:tokenType', aiController.retrieveToken);

// 3. ASYNC AUTHORIZATION
/**
 * @swagger
 * /api/ai/async-authorization:
 *   post:
 *     summary: Authorize async AI agent for background tasks
 *     tags: [AI Assistant - Async Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - agentId
 *               - taskType
 *               - resources
 *             properties:
 *               agentId:
 *                 type: string
 *                 description: Unique identifier for the async agent
 *               taskType:
 *                 type: string
 *                 enum: [order_processing, inventory_update, recommendation_generation]
 *                 description: Type of background task
 *               resources:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Resources the agent needs access to
 *               duration:
 *                 type: number
 *                 description: Authorization duration in milliseconds
 *     responses:
 *       200:
 *         description: Async agent authorized successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Authentication required
 */
router.post('/async-authorization', [
  body('agentId').isString().notEmpty(),
  body('taskType').isIn(['order_processing', 'inventory_update', 'recommendation_generation']),
  body('resources').isArray(),
  body('duration').optional().isNumeric(),
  validateRequest,
], aiController.authorizeAsyncAgent);

// 4. FGA FOR RAG
/**
 * @swagger
 * /api/ai/documents:
 *   post:
 *     summary: Get authorized documents using FGA for RAG
 *     tags: [AI Assistant - FGA RAG]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - query
 *             properties:
 *               query:
 *                 type: string
 *                 description: Search query for documents
 *               documentTypes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Types of documents to search
 *               limit:
 *                 type: number
 *                 default: 10
 *                 description: Maximum number of documents to return
 *     responses:
 *       200:
 *         description: Authorized documents retrieved with FGA enforcement
 *       400:
 *         description: Query is required
 *       401:
 *         description: Authentication required
 */
router.post('/documents', [
  body('query').isString().notEmpty(),
  body('documentTypes').optional().isArray(),
  body('limit').optional().isNumeric(),
  validateRequest,
], aiController.getAuthorizedDocuments);

// Enhanced existing endpoints
/**
 * @swagger
 * /api/ai/chat:
 *   post:
 *     summary: Send message to AI assistant with FGA and async capabilities
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
 *               agentId:
 *                 type: string
 *                 description: Optional AI agent ID for authentication
 *     responses:
 *       200:
 *         description: AI response with FGA context
 *       401:
 *         description: Authentication required
 */
router.post('/chat', [
  body('message').isString().notEmpty(),
  body('context').optional().isObject(),
  body('agentId').optional().isString(),
  validateRequest,
], aiController.chat);

/**
 * @swagger
 * /api/ai/context:
 *   get:
 *     summary: Get AI context for current user with FGA filtering
 *     tags: [AI Assistant]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: AI context with FGA permissions
 *       401:
 *         description: Authentication required
 */
router.get('/context', aiController.getContext);

/**
 * @swagger
 * /api/ai/recommendations:
 *   get:
 *     summary: Get AI-powered product recommendations with FGA filtering
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
 *         description: Product recommendations filtered with FGA
 *       401:
 *         description: Authentication required
 */
router.get('/recommendations', aiController.getRecommendations);

export default router;
