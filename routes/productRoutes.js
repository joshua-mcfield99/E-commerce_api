const express = require('express');
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const authenticateToken = require('../middleware/authMiddleware');
const checkAdminRole = require('../middleware/adminMiddleware');

const router = express.Router();

// Create a new product (Admin only)
/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     description: Only accessible by admin users.
 *     tags:
 *       - Products
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
 *               stock:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: The created product.
 *       403:
 *         description: Access denied.
 */
router.post('/products', authenticateToken, checkAdminRole, createProduct);

// Get all products, optional filtering by category
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retrieve a list of products
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: A list of products.
 */
router.get('/products', getProducts);

// Get a single product by ID
/**
 * @swagger
 * /api/products/{product_id}:
 *   get:
 *     summary: Retrieve a single product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: product_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product ID.
 *     responses:
 *       200:
 *         description: A single product.
 *       404:
 *         description: Product not found.
 */
router.get('/products/:productId', getProductById);

// Update a product by ID (Admin only)
/**
 * @swagger
 * /api/products/{product_id}:
 *   put:
 *     summary: Update a product by ID
 *     description: Only accessible by admin users.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: product_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product ID.
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
 *               stock:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: The updated product.
 *       403:
 *         description: Access denied.
 *       404:
 *         description: Product not found.
 */
router.put('/products/:productId', authenticateToken, checkAdminRole, updateProduct);

// Delete a product by ID (Admin only)
/**
 * @swagger
 * /api/products/{product_id}:
 *   delete:
 *     summary: Delete a product by ID
 *     description: Only accessible by admin users.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: product_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product ID.
 *     responses:
 *       200:
 *         description: Product deleted.
 *       403:
 *         description: Access denied.
 *       404:
 *         description: Product not found.
 */
router.delete('/products/:productId', authenticateToken, checkAdminRole, deleteProduct);

module.exports = router;