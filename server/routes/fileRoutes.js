const express = require('express');
const router = express.Router();
const multer = require('multer');
const fileController = require('../controllers/fileController');
const authMiddleware = require('../middleware/authMiddleware');

const upload = multer({ dest: 'uploads/' });

router.post(
  '/upload',
  [authMiddleware, upload.single('excelFile')],
  fileController.uploadFile
);

router.get('/history', authMiddleware, fileController.getHistory);

router.delete('/:id', authMiddleware, fileController.deleteFile);

module.exports = router;
