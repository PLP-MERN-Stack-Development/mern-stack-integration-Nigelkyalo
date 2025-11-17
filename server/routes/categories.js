// categories.js - Routes for category endpoints

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Validation rules
const categoryValidation = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
];

// Routes
router.get('/', getCategories);
router.get('/:id', getCategory);
router.post(
  '/',
  protect,
  authorize('admin'),
  categoryValidation,
  validate,
  createCategory
);
router.put(
  '/:id',
  protect,
  authorize('admin'),
  categoryValidation,
  validate,
  updateCategory
);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

module.exports = router;

