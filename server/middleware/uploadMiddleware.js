const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('excelFile'); // 'excelFile' is the name of the form field

// Check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /xlsx|xls/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.mimetype === 'application/vnd.ms-excel';

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Excel Files Only!');
  }
}

module.exports = upload;
