const express = require('express');
const Course = require('../models/Course');
const { adminAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'thumbnail' || file.fieldname === 'certificateImage') {
      cb(null, 'uploads/images/');
    } else if (file.fieldname.startsWith('moduleFile')) {
      cb(null, 'uploads/pdfs/');
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Create course
router.post('/courses', adminAuth, upload.any(), async (req, res) => {
  try {
    console.log('--- DEBUG: Create Course Start ---');
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Body keys:', Object.keys(req.body));
    const { data } = req.body;
    console.log('Raw data field:', data);
    
    if (!data) {
      console.log('Error: Missing course data');
      return res.status(400).json({ message: 'Missing course data' });
    }
    
    let parsedData;
    try {
      parsedData = JSON.parse(data);
      console.log('Parsed data:', JSON.stringify(parsedData, null, 2));
    } catch (e) {
      console.log('Error: JSON parse failed:', e.message);
      return res.status(400).json({ message: 'Invalid JSON data' });
    }
    
    const { courseId, name, description, modules } = parsedData;
    console.log('Extracted modules:', modules);
    console.log('Modules type:', typeof modules);
    console.log('Is modules array:', Array.isArray(modules));
    if (modules) console.log('Modules length:', modules.length);
    
    // Process files
    let thumbnail = '';
    let certificateImage = '';
    const moduleFiles = {};
    
    if (req.files) {
      req.files.forEach(file => {
        if (file.fieldname === 'thumbnail') thumbnail = `uploads/images/${file.filename}`;
        else if (file.fieldname === 'certificateImage') certificateImage = `uploads/images/${file.filename}`;
        else if (file.fieldname.startsWith('moduleFile_')) {
          const index = parseInt(file.fieldname.split('_')[1]);
          moduleFiles[index] = `uploads/pdfs/${file.filename}`;
        }
      });
    }
    
    // Check if course ID already exists
    const existingCourse = await Course.findOne({ courseId });
    if (existingCourse) {
      return res.status(400).json({ message: 'Course ID already exists' });
    }
    
    // Validate modules
    if (!modules || !Array.isArray(modules) || modules.length === 0) {
      return res.status(400).json({ message: 'At least one module is required' });
    }
    
    const { extractTextFromPDF } = require('../utils/pdfExtractor');
    
    // Process modules and extract text
    const processedModules = [];
    for (let i = 0; i < modules.length; i++) {
      const module = modules[i];
      if (!module.name || !module.name.trim()) {
        return res.status(400).json({ message: `Module ${i + 1} name is required` });
      }
      
      const pdfPath = moduleFiles[i];
      if (!pdfPath) {
        return res.status(400).json({ message: `Module ${i + 1} PDF file is required` });
      }
      
      let extractedText = '';
      try {
        extractedText = await extractTextFromPDF(pdfPath);
      } catch (err) {
        console.error(`Error extracting text for module ${module.name}:`, err);
      }
      
      processedModules.push({
        name: module.name.trim(),
        pdfPath,
        extractedText,
        order: module.order || (i + 1)
      });
    }
    
    const courseData = {
      courseId,
      name,
      description: description || '',
      thumbnail: thumbnail || '',
      certificateImage: certificateImage || '',
      modules: processedModules,
      createdBy: req.user._id
    };
    
    const course = new Course(courseData);
    
    const savedCourse = await course.save();
    
    res.status(201).json({ message: 'Course created successfully', course: savedCourse });
  } catch (error) {
    console.error('❌ Create course error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update course
router.put('/courses/:id', adminAuth, upload.any(), async (req, res) => {
  try {
    const { data } = req.body;
    let parsedData = {};
    if (data) {
      parsedData = JSON.parse(data);
    } else {
      parsedData = req.body;
    }
    
    const { name, description, modules } = parsedData;
    
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Process files
    let thumbnail = '';
    let certificateImage = '';
    const moduleFiles = {};
    
    if (req.files) {
      req.files.forEach(file => {
        if (file.fieldname === 'thumbnail') thumbnail = `uploads/images/${file.filename}`;
        else if (file.fieldname === 'certificateImage') certificateImage = `uploads/images/${file.filename}`;
        else if (file.fieldname.startsWith('moduleFile_')) {
          const index = parseInt(file.fieldname.split('_')[1]);
          moduleFiles[index] = `uploads/pdfs/${file.filename}`;
        }
      });
    }
    
    // Update basic fields
    if (name) course.name = name;
    if (description !== undefined) course.description = description;
    if (thumbnail) course.thumbnail = thumbnail;
    if (certificateImage) course.certificateImage = certificateImage;
    
    const { extractTextFromPDF } = require('../utils/pdfExtractor');
    
    // Update modules if provided
    if (modules && Array.isArray(modules)) {
      const updatedModules = [];
      for (let i = 0; i < modules.length; i++) {
        const module = modules[i];
        if (!module.name || !module.name.trim()) {
          return res.status(400).json({ message: `Module ${i + 1} name is required` });
        }
        
        let pdfPath = moduleFiles[i] || module.pdfPath;
        if (!pdfPath || !pdfPath.trim()) {
          return res.status(400).json({ message: `Module ${i + 1} PDF file or path is required` });
        }
        
        // Find existing module to carry over extractedText if file didn't change
        const existingModule = course.modules.find(m => m.pdfPath === pdfPath);
        let extractedText = existingModule ? existingModule.extractedText : '';
        
        if (moduleFiles[i]) {
          // New file uploaded, extract text
          try {
            extractedText = await extractTextFromPDF(pdfPath);
          } catch (err) {
            console.error(`Error extracting text for module ${module.name}:`, err);
          }
        }
        
        updatedModules.push({
          name: module.name.trim(),
          pdfPath: pdfPath.trim(),
          extractedText,
          order: module.order || (i + 1)
        });
      }
      course.modules = updatedModules;
    }
    
    await course.save();
    res.json({ message: 'Course updated successfully', course });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete course
router.delete('/courses/:id', adminAuth, async (req, res) => {
  try {
    const { adminKey } = req.body;
    
    // Verify admin key
    const correctAdminKey = process.env.ADMIN_KEY || 'admin123';
    if (adminKey !== correctAdminKey) {
      return res.status(400).json({ message: 'Invalid admin key' });
    }
    
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all courses (admin view)
router.get('/courses', adminAuth, async (req, res) => {
  try {
    const courses = await Course.find().populate('createdBy', 'name').sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Serve PDF files
router.get('/pdf/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../uploads/pdfs/', filename);
    
    // Check if file exists
    const fs = require('fs');
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'PDF file not found' });
    }
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.sendFile(filePath);
  } catch (error) {
    console.error('PDF serve error:', error);
    res.status(500).json({ message: 'Error serving PDF file' });
  }
});

// Admin Dashboard Metrics
router.get('/metrics', adminAuth, async (req, res) => {
  try {
    const User = require('../models/User');
    const Course = require('../models/Course');
    const Activity = require('../models/Activity');

    const totalCourses = await Course.countDocuments();
    const students = await User.find({ role: 'student' });
    
    let totalEnrollments = 0;
    let certificatesIssued = 0;
    let completedCourses = 0;

    students.forEach(student => {
      if (student.enrolledCourses) {
        totalEnrollments += student.enrolledCourses.length;
        student.enrolledCourses.forEach(enrollment => {
          if (enrollment.certificateEarned) certificatesIssued++;
          if (enrollment.progress === 100) completedCourses++;
        });
      }
    });

    const activeStudents = students.length;
    const completionRate = totalEnrollments > 0 ? Math.round((completedCourses / totalEnrollments) * 100) : 0;

    const recentActivity = await Activity.find().sort({ timestamp: -1 }).limit(5);

    res.json({
      totalCourses,
      activeStudents,
      certificatesIssued,
      completionRate: `${completionRate}%`,
      recentActivity
    });

  } catch (error) {
    console.error('Admin metrics error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;