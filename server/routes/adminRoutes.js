const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Import User model
const authMiddleware = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

// Define the admin middleware logic directly in this file to avoid casing issues.
const adminMiddleware = async (req, res, next) => {
    try {
        // We assume authMiddleware has already run and set req.user
        const user = await User.findById(req.user.id);

        if (user && user.isAdmin) {
            next(); // User is an admin, proceed to the controller
        } else {
            res.status(403).json({ msg: 'Access denied. Admin rights required.' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/admin/users
// @desc    Get all users
// @access  Admin
router.get('/users', [authMiddleware, adminMiddleware], adminController.getAllUsers);

// @route   GET api/admin/files
// @desc    Get all files from all users
// @access  Admin
router.get('/files', [authMiddleware, adminMiddleware], adminController.getAllFiles);

module.exports = router;

