const User = require('../models/user');
const File = require('../models/File');

// @desc    Get all users (for admin)
// @route   GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    // Find all users and exclude their passwords from the result
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all files from all users (for admin)
// @route   GET /api/admin/files
exports.getAllFiles = async (req, res) => {
  try {
    // Find all files, sort by newest, and populate the user's name and email
    const files = await File.find().sort({ uploadDate: -1 }).populate('user', ['name', 'email']);
    res.json(files);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
