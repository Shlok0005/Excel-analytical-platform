const File = require('../models/File');
// We will use a library to parse Excel files, but it's a frontend concern.
// The backend just stores the file and its metadata.
// The frontend will read the file, send data for visualization.
// For simplicity, we'll just handle the upload and history here.

// Upload File
exports.uploadFile = async (req, res) => {
  if (req.file == undefined) {
    return res.status(400).json({ msg: 'Error: No File Selected!' });
  }
  
  try {
    const newFile = new File({
      user: req.user.id,
      fileName: req.file.originalname,
      filePath: req.file.path,
    });

    const file = await newFile.save();
    res.json(file);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get User's File History
exports.getFileHistory = async (req, res) => {
  try {
    const files = await File.find({ user: req.user.id }).sort({ uploadDate: -1 });
    res.json(files);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Admin: Get all files (for stats)
exports.getAllFiles = async (req, res) => {
    // Admin check middleware should be used before this controller
    try {
        const files = await File.find().populate('user', ['name', 'email']);
        res.json(files);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// ... at the end of the file
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ msg: 'File not found' });
    }

    // Make sure user owns the file
    if (file.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // In a real app, you would also delete the file from the server's file system
    // const fs = require('fs');
    // fs.unlinkSync(file.filePath);

    await File.findByIdAndDelete(req.params.id);

    res.json({ msg: 'File removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};