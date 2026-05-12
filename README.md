#  Interactive Learning Pathway System (ILPS)

[![Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini-blueviolet?style=for-the-badge&logo=google-gemini)](https://aistudio.google.com/)
[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge)](https://www.mongodb.com/mern-stack)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

An intelligent, AI-driven educational platform that transforms static PDF course materials into interactive, grounded learning experiences. ILPS leverages **Google Gemini AI** to automate assessment generation and provide a personalized study assistant for every student.

---

##  Key Features

### Zigzag Learning Pathway
Experience a modern, gamified course structure. Modules are arranged in a **zigzag map layout** that visualizes your journey.
- **Sequential Locking**: Enforces a strict learning order. Module N unlocks only after passing Module N-1 with a score of 70% or higher.
- **Dynamic States**: Modules clearly indicate whether they are `COMPLETED`, `ACTIVE`, or `LOCKED` with unique visual cues and animations.

###  Grounded AI Study Assistant
A context-aware chat widget integrated directly into the module viewer.
- **RAG-based Grounding**: The assistant is strictly grounded in the current module's PDF content. It won't use outside knowledge, ensuring academic integrity.
- **Quick Quizzes**: Generate on-demand, single-question practice quizzes mid-conversation to test your immediate understanding.
- **Multi-Turn Chat**: Remembers conversation context for up to 10 messages.

### AI Assessment Engine
- **Automatic PDF Analysis**: Instantly extracts text from uploaded PDFs to generate comprehensive Multiple Choice Question (MCQ) quizzes.
- **Smart Retakes**: Failed a quiz? Regenerate a new set of questions from the same material to ensure true mastery.

###  Professional Certification
Earn a **Unique Verified Certificate** upon completion of the entire course.
- **Auto-Generation**: Certificates include the student's name, course title, average score, and a unique verification code.
- **Print-Ready**: Styled for high-quality PDF export directly from the browser.

---

##  Technical Highlights

- **API Key Rotation System**: Built-in `geminiRotator` utility that cycles through multiple API keys to bypass free-tier rate limits and ensure 100% service uptime.
- **Grounded System Prompts**: Custom-engineered prompts that force the AI to cite sources from the provided `extractedText`.
- **Premium Glassmorphism UI**: A stunning dark-mode aesthetic built with Tailwind CSS and Framer Motion for smooth micro-interactions.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React (Vite), Framer Motion, Lucide React, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **AI SDK** | Google Generative AI (@google/generative-ai) |
| **Styling** | Vanilla CSS, Tailwind CSS |

---

## ⚙️ Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas or Local Instance
- Google Gemini API Key(s)

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
ADMIN_KEY=your_admin_signup_key
GEMINI_API_KEY_1=your_first_key
GEMINI_API_KEY_2=your_second_key
# Add as many keys as needed
```

### 3. Installation & Run
```bash
# Install dependencies
npm install

# Start both frontend and backend (concurrently)
npm start
```

---

##  Project Structure

```bash
├── server/             
│   ├── models/         # Mongoose schemas (User, Course, Certificate)
│   ├── routes/         # API endpoints (Auth, Courses, Quiz, Assistant)
│   ├── utils/          # AI logic (callGemini, geminiRotator, pdfExtractor)
│   └── index.js        # Entry point
├── src/                
│   ├── components/     # AIStudyAssistant, ModuleCard, etc.
│   ├── pages/          # CourseDetail, Certificate, Courses, etc.
│   └── App.jsx         # Routing logic
└── uploads/            # PDF and Thumbnail storage
```

---

##  Contribution & License

This project was built as a capstone for the **ADBMS Project**. 
Distributed under the **MIT License**.
