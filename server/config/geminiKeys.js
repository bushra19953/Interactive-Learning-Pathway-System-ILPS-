// FILE: server/config/geminiKeys.js
require('dotenv').config();

const GEMINI_KEYS = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
  process.env.GEMINI_API_KEY_5
].filter(key => key); // Only include keys that are actually defined

module.exports = GEMINI_KEYS;
