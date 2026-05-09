# Interactive Learning Pathway System (ILPS) 

An intelligent educational platform that automatically generates personalized assessments from PDF course materials using Google Gemini AI.

![ILPS Banner](https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1200)

##  Features

- **AI-Powered Quiz Generation**: Automatically creates Multiple Choice Questions (MCQs) by analyzing uploaded PDF modules using Google Gemini AI.
- **Course Management**: Admins can create, update, and manage courses with thumbnails and PDF modules.
- **Student Dashboard**: Interactive learning path where students can enroll in courses, track progress, and take quizzes.
- **Certification**: Earn AI-verified certificates upon completion of final examinations.
- **Modern UI/UX**: Premium design with dark mode, glassmorphism, and smooth animations powered by Framer Motion.
- **Multi-Key API Rotation**: Built-in logic to rotate through multiple Gemini API keys to bypass free-tier rate limits.

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **AI Integration**: Google Generative AI (Gemini 2.0 / Flash-Latest)
- **File Handling**: Multer (Uploads), PDF-Parse (Text Extraction)

##  Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB installed and running locally
- Google Gemini API Key(s) from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and copy content from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Add your MongoDB URI and Gemini API keys to the `.env` file.

4. **Run the Application**
   ```bash
   # Start both frontend and backend concurrently
   npm start
   ```

##  Project Structure

```
├── server/             # Backend Express server
│   ├── config/         # Configuration files (DB, AI Keys)
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoints
│   ├── utils/          # Helper functions (AI generator, PDF extractor)
│   └── index.js        # Server entry point
├── src/                # Frontend React application
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   └── App.jsx         # Main application logic
├── uploads/            # Local storage for PDFs and images (gitignored)
└── package.json        # Project dependencies and scripts
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Google Gemini Team for the powerful generative AI models.
- Lucide React for the beautiful icons.
- Framer Motion for the seamless animations.


