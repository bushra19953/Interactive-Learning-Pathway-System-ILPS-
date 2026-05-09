// FILE: server/config/geminiKeys.js
require('dotenv').config();

const GEMINI_KEYS = [
  process.env.GEMINI_API_KEY_1 || process.env.GEMINI_API_KEY || 'AIzaSyCeO9g1-07MagKl8pMW0rBYggO_kW3Fib8',
  process.env.GEMINI_API_KEY_2 || process.env.GEMINI_API_KEY || 'AIzaSyCeO9g1-07MagKl8pMW0rBYggO_kW3Fib8',
  process.env.GEMINI_API_KEY_3 || process.env.GEMINI_API_KEY || 'AIzaSyCeO9g1-07MagKl8pMW0rBYggO_kW3Fib8',
  process.env.GEMINI_API_KEY_4 || process.env.GEMINI_API_KEY || 'AIzaSyCeO9g1-07MagKl8pMW0rBYggO_kW3Fib8',
  process.env.GEMINI_API_KEY_5 || process.env.GEMINI_API_KEY || 'AIzaSyCeO9g1-07MagKl8pMW0rBYggO_kW3Fib8'
];

module.exports = GEMINI_KEYS;
