const { callGemini } = require('./callGemini');

const generateQuizFromText = async (pdfText, quizType = 'module', numQuestions = 5) => {
  try {
    // Adjust number of questions based on quiz type
    const questionCount = quizType === 'final' ? 10 : 5;
    
    const prompt = `
Based on the following educational content, generate ${questionCount} multiple-choice questions (MCQs) for a ${quizType} quiz.

Content:
${pdfText.substring(0, 4000)} // Limit text to avoid token limits

Requirements:
1. Generate exactly ${questionCount} questions
2. Each question should have 4 options (A, B, C, D)
3. Questions should test understanding, not just memorization
4. Include the correct answer index (0-3)
5. Provide a brief explanation for each correct answer
6. Questions should be relevant to the content provided
7. Vary the difficulty level appropriately

Please format your response as a JSON array with this exact structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Brief explanation of why this is correct"
  }
]

Make sure the response is valid JSON only, no additional text.
`;

    const text = await callGemini(prompt);
    
    // Clean the response to extract JSON
    let cleanedText = text.trim();
    
    // Remove markdown code blocks if present
    if (cleanedText.startsWith('\`\`\`json')) {
      cleanedText = cleanedText.replace(/\`\`\`json\n?/, '').replace(/\n?\`\`\`$/, '');
    } else if (cleanedText.startsWith('\`\`\`')) {
      cleanedText = cleanedText.replace(/\`\`\`\n?/, '').replace(/\n?\`\`\`$/, '');
    }
    
    // Parse the JSON response
    const questions = JSON.parse(cleanedText);
    
    // Validate the response structure
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Invalid response format from Gemini API');
    }
    
    // Validate each question
    questions.forEach((q, index) => {
      if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || 
          typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
        throw new Error(`Invalid question format at index ${index}`);
      }
    });
    
    return { questions, isAI: true };
    
  } catch (error) {
    console.error('Error generating quiz with Gemini:', error);
    
    // Fallback to default questions if API fails
    return { questions: generateFallbackQuestions(quizType), isAI: false };
  }
};

const generateFallbackQuestions = (quizType) => {
  const baseQuestions = [
    {
      question: "What is the main topic covered in this module?",
      options: [
        "Basic concepts and fundamentals",
        "Advanced techniques only",
        "Practical applications only",
        "Historical background only"
      ],
      correctAnswer: 0,
      explanation: "This module covers comprehensive basics including fundamental concepts, principles, and introductory applications."
    },
    {
      question: "Which approach is most effective for learning the material?",
      options: [
        "Memorizing all content",
        "Understanding concepts and practicing",
        "Reading once quickly",
        "Skipping difficult sections"
      ],
      correctAnswer: 1,
      explanation: "Understanding core concepts combined with regular practice leads to better retention and application of knowledge."
    },
    {
      question: "What should be your primary focus when studying this content?",
      options: [
        "Speed of completion",
        "Comprehension and application",
        "Perfect memorization",
        "Comparing with other sources"
      ],
      correctAnswer: 1,
      explanation: "Focus on understanding the material deeply and being able to apply the concepts in practical scenarios."
    },
    {
      question: "How can you best retain the information from this module?",
      options: [
        "Read it once and move on",
        "Take notes and review regularly",
        "Only focus on highlighted text",
        "Memorize word for word"
      ],
      correctAnswer: 1,
      explanation: "Active note-taking and regular review help reinforce learning and improve long-term retention."
    },
    {
      question: "What indicates successful completion of this learning module?",
      options: [
        "Reading all pages quickly",
        "Understanding key concepts and their applications",
        "Memorizing all definitions",
        "Completing in minimum time"
      ],
      correctAnswer: 1,
      explanation: "Success is measured by your ability to understand, explain, and apply the key concepts learned in the module."
    }
  ];
  
  const finalQuestions = [
    {
      question: "Which statement best describes the overall learning objectives of this course?",
      options: [
        "To memorize specific facts and figures",
        "To develop comprehensive understanding and practical skills",
        "To complete assignments quickly",
        "To pass the final exam only"
      ],
      correctAnswer: 1,
      explanation: "The course aims to build both theoretical understanding and practical application skills for real-world scenarios."
    },
    {
      question: "What is the most important outcome of completing this course?",
      options: [
        "Getting a certificate",
        "Gaining applicable knowledge and skills",
        "Finishing all modules",
        "Passing all quizzes"
      ],
      correctAnswer: 1,
      explanation: "The primary goal is to acquire knowledge and skills that can be applied in professional or academic contexts."
    },
    {
      question: "How should the concepts learned in this course be applied?",
      options: [
        "Only in academic settings",
        "In real-world projects and scenarios",
        "Only during examinations",
        "Never outside the course"
      ],
      correctAnswer: 1,
      explanation: "The concepts are designed to be practical and applicable in real-world professional situations."
    },
    {
      question: "What demonstrates mastery of the course material?",
      options: [
        "Completing all readings",
        "Ability to explain and apply concepts",
        "Perfect quiz scores",
        "Fast completion time"
      ],
      correctAnswer: 1,
      explanation: "True mastery is shown through the ability to explain concepts clearly and apply them effectively."
    },
    {
      question: "What should be your next step after completing this course?",
      options: [
        "Forget the material",
        "Apply the knowledge in practical projects",
        "Only review for tests",
        "Move to unrelated topics"
      ],
      correctAnswer: 1,
      explanation: "Continued application and practice of the learned concepts will reinforce and expand your expertise."
    }
  ];
  
  if (quizType === 'final') {
    return [...baseQuestions, ...finalQuestions].slice(0, 10);
  }
  
  return baseQuestions.slice(0, 5);
};

module.exports = { generateQuizFromText };