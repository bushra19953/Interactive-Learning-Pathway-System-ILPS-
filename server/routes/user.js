const express = require('express');
const User = require('../models/User');
const Course = require('../models/Course');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user's enrolled courses
router.get('/enrolled-courses', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('enrolledCourses.courseId');
    const enrolledCourses = user.enrolledCourses.map(enrollment => enrollment.courseId);
    res.json(enrolledCourses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user progress
router.get('/progress', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const progress = {};
    
    user.enrolledCourses.forEach(enrollment => {
      progress[enrollment.courseId] = {
        percentage: enrollment.progress,
        completedModules: enrollment.completedModules
      };
    });
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user stats
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    const completedCourses = user.enrolledCourses.filter(
      enrollment => enrollment.progress === 100
    ).length;
    
    const totalModules = user.enrolledCourses.reduce(
      (total, enrollment) => total + enrollment.completedModules.length, 0
    );
    
    const certificatesEarned = user.enrolledCourses.filter(
      enrollment => enrollment.certificate
    ).length;
    
    res.json({
      completedCourses,
      totalModules,
      certificatesEarned,
      studyTime: Math.floor(Math.random() * 100) + 20 // Mock data
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update module progress
router.post('/progress/:courseId/:moduleId', auth, async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;
    const { quizScore } = req.body;
    
    const user = await User.findById(req.user._id);
    const enrollment = user.enrolledCourses.find(
      e => e.courseId.toString() === courseId
    );
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Not enrolled in this course' });
    }
    
    // Check if module already completed
    const existingModule = enrollment.completedModules.find(
      m => m.moduleId === moduleId
    );
    
    if (!existingModule) {
      enrollment.completedModules.push({
        moduleId,
        completedAt: new Date(),
        quizScore
      });
    } else {
      existingModule.quizScore = quizScore;
    }
    
    // Update overall progress
    const course = await Course.findById(courseId);
    const totalModules = course.modules.length;
    const completedModules = enrollment.completedModules.length;
    enrollment.progress = Math.round((completedModules / totalModules) * 100);
    
    // Log quiz activity
    const Activity = require('../models/Activity');
    const quizActivity = new Activity({
      type: 'quiz_completed',
      description: `${user.name} completed quiz for module in ${course.name} with score ${quizScore}%`
    });
    await quizActivity.save();

    // Check for certificate
    if (enrollment.progress === 100 && !enrollment.certificateEarned) {
      enrollment.certificateEarned = true;
      const certActivity = new Activity({
        type: 'certificate_issued',
        description: `Certificate issued to ${user.name} for completing ${course.name}`
      });
      await certActivity.save();
    }
    
    await user.save();
    res.json({ 
      message: 'Progress updated successfully', 
      progress: enrollment.progress,
      certificateEarned: enrollment.certificateEarned 
    });
  } catch (error) {
    console.error('Progress update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;