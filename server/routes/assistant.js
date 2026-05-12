const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { callGemini } = require('../utils/callGemini');
const { auth } = require('../middleware/auth');

// POST /api/assistant/chat
router.post('/chat', auth, async (req, res) => {
  try {
    const { moduleId, messages } = req.body;

    if (!moduleId || !messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    const course = await Course.findOne({ 'modules._id': moduleId });
    if (!course) {
      return res.status(404).json({ message: 'Module not found' });
    }

    const moduleData = course.modules.id(moduleId);
    
    if (!moduleData.extractedText || moduleData.extractedText.trim() === '') {
      return res.status(400).json({ error: 'No PDF content available for this module' });
    }

    // Format chat history
    let historyPrompt = '';
    const last10Messages = messages.slice(-10); // Use only the last 10 messages
    
    last10Messages.forEach(msg => {
      historyPrompt += `\n${msg.role === 'user' ? 'Student' : 'Assistant'}: ${msg.content}`;
    });

    const systemPrompt = `You are a study assistant for an online learning platform called ILPS. 
You must ONLY answer questions based on the following course material. 
Do NOT use any outside knowledge. If the answer is not in the material, 
say: 'I could not find this in your module content — please refer to your instructor.'
Always be encouraging and concise. Keep answers under 100 words unless 
the student asks for more detail.

Course material:
${moduleData.extractedText}

Conversation History:${historyPrompt}

Assistant:`;

    try {
      const reply = await callGemini(systemPrompt);
      return res.json({ reply, moduleId });
    } catch (apiError) {
      console.error('Gemini API Error in /chat:', apiError);
      return res.status(503).json({ error: 'Assistant temporarily unavailable. Try again shortly.' });
    }

  } catch (error) {
    console.error('Assistant Chat Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/assistant/quickquiz
router.post('/quickquiz', auth, async (req, res) => {
  try {
    const { moduleId } = req.body;

    if (!moduleId) {
      return res.status(400).json({ message: 'Module ID is required' });
    }

    const course = await Course.findOne({ 'modules._id': moduleId });
    if (!course) {
      return res.status(404).json({ message: 'Module not found' });
    }

    const moduleData = course.modules.id(moduleId);
    
    if (!moduleData.extractedText || moduleData.extractedText.trim() === '') {
      return res.status(400).json({ error: 'No PDF content available for this module' });
    }

    const systemPrompt = `Based on this content, generate 1 multiple choice question to test 
understanding. Return ONLY valid JSON, no markdown:
{ "question": "string", "options": {"A": "string", "B": "string", "C": "string", "D": "string"}, "answer": "A", "explanation": "string" }

Content:
${moduleData.extractedText}`;

    try {
      const reply = await callGemini(systemPrompt);
      
      // Attempt to parse JSON response. Sometimes models wrap it in markdown.
      let jsonStr = reply.trim();
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.substring(7);
        if (jsonStr.endsWith('```')) {
          jsonStr = jsonStr.substring(0, jsonStr.length - 3);
        }
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.substring(3);
        if (jsonStr.endsWith('```')) {
          jsonStr = jsonStr.substring(0, jsonStr.length - 3);
        }
      }
      
      const parsedJson = JSON.parse(jsonStr);
      
      return res.json(parsedJson);
    } catch (apiError) {
      console.error('Gemini API Error in /quickquiz:', apiError);
      return res.status(503).json({ error: 'Assistant temporarily unavailable. Try again shortly.' });
    }

  } catch (error) {
    console.error('Assistant Quick Quiz Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
