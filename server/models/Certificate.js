const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  avgQuizScore: {
    type: Number,
    required: true
  },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  certificateCode: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('Certificate', certificateSchema);
