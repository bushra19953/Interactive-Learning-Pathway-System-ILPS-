// FILE: server/utils/geminiRotator.js
const GEMINI_KEYS = require('../config/geminiKeys');

let currentIndex = 0;
// Track exhausted keys with a cooldown until timestamp
const exhaustedKeys = new Map();
const COOLDOWN_MS = 60 * 60 * 1000; // 1 hour cooldown

const getNextKey = () => {
  const startIndex = currentIndex;
  
  do {
    const key = GEMINI_KEYS[currentIndex];
    const isExhausted = exhaustedKeys.has(key);
    
    // Check if cooldown has expired
    if (isExhausted && exhaustedKeys.get(key) < Date.now()) {
      exhaustedKeys.delete(key);
    }
    
    if (!exhaustedKeys.has(key)) {
      const selectedKey = key;
      // Increment and wrap around
      currentIndex = (currentIndex + 1) % GEMINI_KEYS.length;
      return { key: selectedKey, index: currentIndex === 0 ? GEMINI_KEYS.length - 1 : currentIndex - 1 };
    }
    
    // Increment and wrap around
    currentIndex = (currentIndex + 1) % GEMINI_KEYS.length;
    
  } while (currentIndex !== startIndex);

  // If all keys are exhausted, just return the first one and hope for the best (or we could throw an error)
  console.warn('⚠️ All Gemini keys are currently marked as exhausted! Attempting to use the first key anyway.');
  return { key: GEMINI_KEYS[0], index: 0 };
};

const markKeyExhausted = (key, index) => {
  console.error(`🔴 Gemini API Key at index ${index} exhausted (429/503). Applying cooldown.`);
  exhaustedKeys.set(key, Date.now() + COOLDOWN_MS);
};

module.exports = {
  getNextKey,
  markKeyExhausted
};
