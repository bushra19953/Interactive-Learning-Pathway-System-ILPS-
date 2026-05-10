const express = require('express');
const Certificate = require('../models/Certificate');
const User = require('../models/User');
const Course = require('../models/Course');
const { auth } = require('../middleware/auth');

const router = express.Router();

const generateCertificateCode = (studentName, courseName) => {
  const year = new Date().getFullYear();
  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 3);
  const studentInitials = getInitials(studentName) || 'STU';
  const courseInitials = getInitials(courseName) || 'CRS';
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ILPS-${year}-${studentInitials}-${courseInitials}-${randomChars}`;
};

// Get or generate certificate
router.get('/:studentId/:courseId', auth, async (req, res) => {
  try {
    const { studentId, courseId } = req.params;

    // Check if user is requesting their own certificate
    if (studentId !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this certificate' });
    }

    let certificate = await Certificate.findOne({ studentId, courseId });
    
    if (certificate) {
      return res.json(certificate);
    }

    const user = await User.findById(studentId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(404).json({ message: 'User or course not found' });
    }

    const enrollment = user.enrolledCourses.find(e => e.courseId.toString() === courseId);

    if (!enrollment || enrollment.progress < 100) {
      return res.status(400).json({ message: 'Course not fully completed yet' });
    }

    // Calculate average quiz score
    const totalScore = enrollment.completedModules.reduce((sum, mod) => sum + mod.quizScore, 0);
    const avgQuizScore = enrollment.completedModules.length > 0 
      ? Math.round(totalScore / enrollment.completedModules.length) 
      : 0;

    certificate = new Certificate({
      studentId,
      courseId,
      studentName: user.name,
      courseName: course.name,
      avgQuizScore,
      certificateCode: generateCertificateCode(user.name, course.name)
    });

    await certificate.save();

    // Mark user's enrollment as having earned a certificate
    if (!enrollment.certificateEarned) {
      enrollment.certificateEarned = true;
      await user.save();
    }

    res.json(certificate);
  } catch (error) {
    console.error('Certificate generation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
