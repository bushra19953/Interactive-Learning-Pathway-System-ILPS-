// FILE: server/utils/callGemini.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getNextKey, markKeyExhausted } = require('./geminiRotator');

const callGemini = async (prompt, maxRetries = 5) => {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    const { key, index } = getNextKey();
    const logMsg = `🤖 [Gemini] Attempt ${attempt + 1}/${maxRetries} using API Key index ${index}\n`;
    console.log(logMsg);
    require('fs').appendFileSync('gemini_debug.log', logMsg);
    
    try {
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
      
    } catch (error) {
      console.error(`❌ [Gemini] Error on attempt ${attempt + 1} (Status: ${error.status}):`, error.message);
      
      // Check for rate limit or quota exceeded
      if (error.status === 429 || error.status === 503 || error.message.includes('429') || error.message.includes('quota') || error.message.includes('exhausted')) {
        markKeyExhausted(key, index);
        attempt++;
        if (attempt >= maxRetries) {
          throw new Error('All Gemini API retry attempts failed due to rate limits or quota issues.');
        }
        // Continue to next iteration (next key)
      } else {
        // For other types of errors (e.g. invalid prompt, network issue), throw immediately
        throw error;
      }
    }
  }
};

module.exports = { callGemini };
