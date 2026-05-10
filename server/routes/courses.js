const express = require('express');
const Course = require('../models/Course');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    // Optional auth to get user progress
    const token = req.header('Authorization')?.replace('Bearer ', '');
    let user = null;
    if (token) {
      const jwt = require('jsonwebtoken');
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        user = await User.findById(decoded.userId);
      } catch (err) {}
    }

    const coursesWithDetails = await Promise.all(courses.map(async (course) => {
      const enrolledCount = await User.countDocuments({ 'enrolledCourses.courseId': course._id });
      
      let userProgress = 0;
      let isEnrolled = false;
      
      if (user) {
        const enrollment = user.enrolledCourses.find(e => e.courseId.toString() === course._id.toString());
        if (enrollment) {
          isEnrolled = true;
          userProgress = enrollment.progress || 0;
        }
      }

      return {
        ...course.toObject(),
        enrolledCount,
        isEnrolled,
        userProgress
      };
    }));

    res.json(coursesWithDetails);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single course
router.get('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('createdBy', 'name');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is enrolled
    const user = await User.findById(req.user._id);
    const enrollment = user.enrolledCourses.find(
      enrollment => enrollment.courseId.toString() === course._id.toString()
    );

    res.json({
      ...course.toObject(),
      isEnrolled: !!enrollment,
      userProgress: enrollment ? enrollment.progress : 0,
      completedModules: enrollment ? enrollment.completedModules : [],
      certificateEarned: enrollment ? enrollment.certificateEarned : false
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Enroll in course
router.post('/:id/enroll', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const user = await User.findById(req.user._id);
    const alreadyEnrolled = user.enrolledCourses.some(
      enrollment => enrollment.courseId.toString() === course._id.toString()
    );

    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    user.enrolledCourses.push({
      courseId: course._id,
      enrolledAt: new Date(),
      progress: 0,
      completedModules: []
    });

    await user.save();

    // Log activity
    const Activity = require('../models/Activity');
    const activity = new Activity({
      type: 'enrollment',
      description: `${user.name} enrolled in ${course.name}`
    });
    await activity.save();

    res.json({ message: 'Successfully enrolled in course' });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;