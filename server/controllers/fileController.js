const File = require('../models/File');
const fs = require('fs');
const path = require('path');

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'Please upload a file' });
    }

    const newFile = new File({
      user: req.user.id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
    });

    const file = await newFile.save();
    res.json(file);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getHistory = async (req, res) => {
  try {
    const files = await File.find({ user: req.user.id }).sort({ uploadDate: -1 });
    res.json(files);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ msg: 'File not found' });
    }

    if (file.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    fs.unlink(file.filePath, (err) => {
        if (err) {
            console.error('Could not delete file from filesystem:', err);
        }
    });

    await File.findByIdAndDelete(req.params.id);

    res.json({ msg: 'File removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
