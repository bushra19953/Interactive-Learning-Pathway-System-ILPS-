const express = require('express');
const Quiz = require('../models/Quiz');
const Course = require('../models/Course');
const { auth } = require('../middleware/auth');
const { extractTextFromPDF } = require('../utils/pdfExtractor');
const { generateQuizFromText } = require('../utils/geminiQuizGenerator');

const router = express.Router();

// Generate quiz using Gemini API from PDF content
router.post('/generate/:courseId/:moduleId', auth, async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;
    const { type = 'module' } = req.body;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if quiz already exists
    const existingQuiz = await Quiz.findOne({ courseId, moduleId, type });
    if (existingQuiz) {
      return res.json(existingQuiz);
    }
    
    let pdfText = '';
    
    if (type === 'final') {
      // For final exam, combine text from all modules
      const allTexts = [];
      for (const module of course.modules) {
        if (module.extractedText && module.extractedText.trim().length > 0) {
          allTexts.push(module.extractedText);
        } else {
          try {
            const moduleText = await extractTextFromPDF(module.pdfPath);
            allTexts.push(moduleText);
          } catch (error) {
            console.error(`Error extracting text from ${module.pdfPath}:`, error);
          }
        }
      }
      pdfText = allTexts.join('\n\n');
    } else {
      // For module quiz, find the specific module
      const module = course.modules.find(m => m._id.toString() === moduleId);
      if (!module) {
        return res.status(404).json({ message: 'Module not found' });
      }
      
      if (module.extractedText && module.extractedText.trim().length > 0) {
        pdfText = module.extractedText;
      } else {
        try {
          pdfText = await extractTextFromPDF(module.pdfPath);
        } catch (error) {
          console.error('Error extracting PDF text:', error);
          return res.status(500).json({ message: 'Error reading PDF file' });
        }
      }
    }
    
    // Generate quiz questions using Gemini AI
    const { questions, isAI } = await generateQuizFromText(pdfText, type);
    
    const quiz = new Quiz({
      courseId,
      moduleId,
      type,
      questions,
      isAI,
      passingScore: 70,
      timeLimit: type === 'final' ? 60 : 30
    });
    
    await quiz.save();
    res.json(quiz);
  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get quiz
router.get('/:courseId/:moduleId', auth, async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;
    const { type = 'module', regenerate = false } = req.query;
    
    let quiz = await Quiz.findOne({ courseId, moduleId, type });
    
    if (!quiz || regenerate === 'true' || regenerate === true) {
      if (quiz && (regenerate === 'true' || regenerate === true)) {
        await Quiz.deleteOne({ _id: quiz._id });
      }
      // Auto-generate quiz if it doesn't exist
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      
      let pdfText = '';
      
      if (type === 'final') {
        // For final exam, combine text from all modules
        const allTexts = [];
        for (const module of course.modules) {
          if (module.extractedText && module.extractedText.trim().length > 0) {
            allTexts.push(module.extractedText);
          } else {
            try {
              const moduleText = await extractTextFromPDF(module.pdfPath);
              allTexts.push(moduleText);
            } catch (error) {
              console.error(`Error extracting text from ${module.pdfPath}:`, error);
            }
          }
        }
        pdfText = allTexts.join('\n\n');
      } else {
        // For module quiz, find the specific module
        const module = course.modules.find(m => m._id.toString() === moduleId);
        if (!module) {
          return res.status(404).json({ message: 'Module not found' });
        }
        
        if (module.extractedText && module.extractedText.trim().length > 0) {
          pdfText = module.extractedText;
        } else {
          try {
            pdfText = await extractTextFromPDF(module.pdfPath);
          } catch (error) {
            console.error('Error extracting PDF text:', error);
            return res.status(500).json({ message: 'Error reading PDF file' });
          }
        }
      }
      
      // Generate quiz questions using Gemini AI
      const { questions, isAI } = await generateQuizFromText(pdfText, type);
      
      quiz = new Quiz({
        courseId,
        moduleId,
        type,
        questions,
        isAI,
        passingScore: 70,
        timeLimit: type === 'final' ? 60 : 30
      });
      
      await quiz.save();
    }
    
    // Remove correct answers from response
    const quizData = {
      ...quiz.toObject(),
      questions: quiz.questions.map(q => ({
        question: q.question,
        options: q.options,
        _id: q._id
      }))
    };
    
    res.json(quizData);
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Submit quiz
router.post('/submit/:courseId/:moduleId', auth, async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;
    const { answers, type = 'module' } = req.body;
    
    const quiz = await Quiz.findOne({ courseId, moduleId, type });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Calculate score
    let correctAnswers = 0;
    const results = quiz.questions.map((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correctAnswers++;
      
      return {
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation
      };
    });
    
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;
    
    res.json({
      score,
      passed,
      passingScore: quiz.passingScore,
      results
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;