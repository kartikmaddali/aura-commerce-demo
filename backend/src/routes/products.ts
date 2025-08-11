import express from 'express';
import { body, query, param } from 'express-validator';
import { authenticateToken, requireAuth, requireBrand } from '../middleware/auth';
import { ProductController } from '../controllers/ProductController';
import { validateRequest } from '../middleware/validation';

const router = express.Router();
const productController = new ProductController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         brand:
 *           type: string
 *         category:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         inStock:
 *           type: boolean
 *         stockQuantity:
 *           type: number
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products with optional filtering
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filter by brand (luxeloom, urbanmarket, aura-wholesale)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in product name and description
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: inStock
 *         schema:
 *           type: boolean
 *         description: Filter by stock availability
 *     responses:
 *       200:
 *         description: List of products
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
 *                     $ref: '#/components/schemas/Product'
 */
router.get('/', [
  query('brand').optional().isIn(['luxeloom', 'urbanmarket', 'aura-wholesale']),
  query('category').optional().isString(),
  query('search').optional().isString(),
  query('minPrice').optional().isNumeric(),
  query('maxPrice').optional().isNumeric(),
  query('inStock').optional().isBoolean(),
  validateRequest,
], productController.getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a specific product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get('/:id', [
  param('id').isString().notEmpty(),
  validateRequest,
], productController.getProductById);

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Search products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filter by brand
 *     responses:
 *       200:
 *         description: Search results
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
 *                     $ref: '#/components/schemas/Product'
 */
router.get('/search', [
  query('q').isString().notEmpty(),
  query('brand').optional().isIn(['luxeloom', 'urbanmarket', 'aura-wholesale']),
  validateRequest,
], productController.searchProducts);

/**
 * @swagger
 * /api/products/categories:
 *   get:
 *     summary: Get all product categories
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filter categories by brand
 *     responses:
 *       200:
 *         description: List of categories
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
 *                     type: string
 */
router.get('/categories', [
  query('brand').optional().isIn(['luxeloom', 'urbanmarket', 'aura-wholesale']),
  validateRequest,
], productController.getCategories);

// Protected routes (require authentication)
router.use(authenticateToken);

/**
 * @swagger
 * /api/products/{id}/wishlist:
 *   post:
 *     summary: Add product to wishlist (B2C only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product added to wishlist
 *       403:
 *         description: B2B users cannot use wishlist
 */
router.post('/:id/wishlist', [
  param('id').isString().notEmpty(),
  validateRequest,
], productController.addToWishlist);

/**
 * @swagger
 * /api/products/{id}/wishlist:
 *   delete:
 *     summary: Remove product from wishlist (B2C only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product removed from wishlist
 *       403:
 *         description: B2B users cannot use wishlist
 */
router.delete('/:id/wishlist', [
  param('id').isString().notEmpty(),
  validateRequest,
], productController.removeFromWishlist);

// Admin routes (require admin role)
router.use(requireAuth);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - brand
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               brand:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created successfully
 *       403:
 *         description: Admin access required
 */
router.post('/', [
  body('name').isString().notEmpty(),
  body('description').isString().notEmpty(),
  body('price').isNumeric().isFloat({ min: 0 }),
  body('brand').isIn(['luxeloom', 'urbanmarket', 'aura-wholesale']),
  body('category').isString().notEmpty(),
  body('images').optional().isArray(),
  body('sizes').optional().isArray(),
  body('colors').optional().isArray(),
  body('tags').optional().isArray(),
  validateRequest,
], productController.createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               inStock:
 *                 type: boolean
 *               stockQuantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Product not found
 */
router.put('/:id', [
  param('id').isString().notEmpty(),
  body('name').optional().isString().notEmpty(),
  body('description').optional().isString().notEmpty(),
  body('price').optional().isNumeric().isFloat({ min: 0 }),
  body('inStock').optional().isBoolean(),
  body('stockQuantity').optional().isInt({ min: 0 }),
  validateRequest,
], productController.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Product not found
 */
router.delete('/:id', [
  param('id').isString().notEmpty(),
  validateRequest,
], productController.deleteProduct);

export default router;
