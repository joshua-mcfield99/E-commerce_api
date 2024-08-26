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
router.post('/products', authenticateToken, checkAdminRole, createProduct);

// Get all products, optional filtering by category
router.get('/products', getProducts);

// Get a single product by ID
router.get('/products/:productId', getProductById);

// Update a product by ID (Admin only)
router.put('/products/:productId', authenticateToken, checkAdminRole, updateProduct);

// Delete a product by ID (Admin only)
router.delete('/products/:productId', authenticateToken, checkAdminRole, deleteProduct);

module.exports = router;