const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// @route   POST api/files/upload
// @desc    Upload an excel file
// @access  Private
router.post('/upload', [authMiddleware, uploadMiddleware], fileController.uploadFile);

// @route   GET api/files/history
// @desc    Get user's file upload history
// @access  Private
router.get('/history', authMiddleware, fileController.getFileHistory);

module.exports = router;