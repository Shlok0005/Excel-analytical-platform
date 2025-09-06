const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  analysisData: { // To store columns and maybe a sample of data
    type: Object,
  }
});

module.exports = mongoose.model('file', FileSchema);