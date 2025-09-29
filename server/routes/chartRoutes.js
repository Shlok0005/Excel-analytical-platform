const express = require('express');
const router = express.Router();
const chartController = require('../controllers/chartController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/charts
// @desc    Save a new chart
// @access  Private
router.post('/', authMiddleware, chartController.saveChart);

// @route   GET api/charts
// @desc    Get all saved charts for a user
// @access  Private
router.get('/', authMiddleware, chartController.getCharts);

module.exports = router;