const express = require('express');
const {
    createCategory,
    getCategories,
    getCategoryById,
    deleteCategory
} = require('../controllers/categoryController');
const authenticateToken = require('../middleware/authMiddleware');
const checkAdminRole = require('../middleware/adminMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags:
 *       - Categories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created successfully.
 *       500:
 *         description: Server error.
 *     security:
 *       - bearerAuth: []
 */
router.post('/categories', authenticateToken, checkAdminRole, createCategory);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: A list of categories.
 *       500:
 *         description: Server error.
 */
router.get('/categories', getCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The category ID.
 *     responses:
 *       200:
 *         description: A category object.
 *       404:
 *         description: Category not found.
 *       500:
 *         description: Server error.
 */
router.get('/categories/:id', getCategoryById);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The category ID.
 *     responses:
 *       200:
 *         description: Category deleted successfully.
 *       404:
 *         description: Category not found.
 *       500:
 *         description: Server error.
 *     security:
 *       - bearerAuth: []
 */
router.delete('/categories/:id', authenticateToken, checkAdminRole, deleteCategory);

module.exports = router;