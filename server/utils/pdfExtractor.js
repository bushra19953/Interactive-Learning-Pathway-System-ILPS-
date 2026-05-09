const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const extractTextFromPDF = async (pdfPath) => {
  try {
    // Construct full path to PDF file
    const fullPath = path.join(__dirname, '../../', pdfPath);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      throw new Error(`PDF file not found: ${pdfPath}`);
    }
    
    // Read PDF file
    const dataBuffer = fs.readFileSync(fullPath);
    
    // Extract text from PDF
    const data = await pdf(dataBuffer);
    
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error;
  }
};

module.exports = { extractTextFromPDF };