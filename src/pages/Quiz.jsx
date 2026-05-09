import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Award,
  ArrowRight,
  RotateCcw,
  Loader,
  Brain
} from 'lucide-react';
import axios from 'axios';

const Quiz = () => {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [courseId, moduleId]);

  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0 && !results) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft, results]);

  const fetchQuiz = async () => {
    try {
      setGenerating(true);
      const type = moduleId === 'final' ? 'final' : 'module';
      const response = await axios.get(`http://localhost:5000/api/quiz/${courseId}/${moduleId}?type=${type}`);
      setQuiz(response.data);
      setTimeLeft(response.data.timeLimit * 60); // Convert minutes to seconds
      setAnswers(new Array(response.data.questions.length).fill(null));
    } catch (error) {
      console.error('Error fetching quiz:', error);
      alert('Error loading quiz. Please try again.');
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const type = moduleId === 'final' ? 'final' : 'module';
      const response = await axios.post(`http://localhost:5000/api/quiz/submit/${courseId}/${moduleId}`, {
        answers,
        type
      });
      
      setResults(response.data);
      
      // Update user progress if passed
      if (response.data.passed && moduleId !== 'final') {
        await axios.post(`http://localhost:5000/api/user/progress/${courseId}/${moduleId}`, {
          quizScore: response.data.score
        });
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Error submitting quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const retakeQuiz = () => {
    setResults(null);
    setCurrentQuestion(0);
    setAnswers(new Array(quiz.questions.length).fill(null));
    setTimeLeft(quiz.timeLimit * 60);
    setQuizStarted(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          {generating && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <Brain className="h-8 w-8 text-yellow-400 mx-auto mb-3 animate-pulse" />
              <p className="text-white font-semibold mb-2">Generating Quiz with AI</p>
              <p className="text-gray-300 text-sm">
                Our AI is analyzing the PDF content and creating personalized questions for you...
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Quiz Not Available</h2>
          <p className="text-gray-300 mb-4">Unable to generate quiz from the PDF content.</p>
          <button
            onClick={() => navigate(-1)}
            className="text-yellow-400 hover:text-yellow-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Results Screen
  if (results) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center"
          >
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
              results.passed ? 'bg-emerald-500/20 border-4 border-emerald-400' : 'bg-red-500/20 border-4 border-red-400'
            }`}>
              {results.passed ? (
                <CheckCircle className="h-12 w-12 text-emerald-400" />
              ) : (
                <XCircle className="h-12 w-12 text-red-400" />
              )}
            </div>

            <h1 className="text-4xl font-bold text-white mb-4">
              {results.passed ? 'Congratulations!' : 'Keep Trying!'}
            </h1>
            
            <p className="text-xl text-gray-300 mb-8">
              You scored <span className={`font-bold ${results.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                {results.score}%
              </span> on this AI-generated quiz
            </p>

            <div className="bg-white/5 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{results.score}%</h3>
                  <p className="text-gray-400">Your Score</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{results.passingScore}%</h3>
                  <p className="text-gray-400">Passing Score</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {results.results.filter(r => r.isCorrect).length}/{results.results.length}
                  </h3>
                  <p className="text-gray-400">Correct Answers</p>
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="text-left mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Question Review</h3>
              <div className="space-y-4">
                {results.results.map((result, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-start space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 ${
                        result.isCorrect ? 'bg-emerald-500/20' : 'bg-red-500/20'
                      }`}>
                        {result.isCorrect ? (
                          <CheckCircle className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold mb-2">{result.question}</p>
                        <p className="text-gray-300 text-sm mb-1">
                          Your answer: <span className={result.isCorrect ? 'text-emerald-400' : 'text-red-400'}>
                            {quiz.questions[index].options[result.userAnswer]}
                          </span>
                        </p>
                        {!result.isCorrect && (
                          <p className="text-gray-300 text-sm mb-2">
                            Correct answer: <span className="text-emerald-400">
                              {quiz.questions[index].options[result.correctAnswer]}
                            </span>
                          </p>
                        )}
                        {result.explanation && (
                          <p className="text-gray-400 text-sm italic">{result.explanation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {results.passed ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/course/${courseId}`)}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Award className="h-5 w-5" />
                  <span>Continue Learning</span>
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={retakeQuiz}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <RotateCcw className="h-5 w-5" />
                  <span>Retake Quiz</span>
                </motion.button>
              )}
              
              <button
                onClick={() => navigate(`/course/${courseId}`)}
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 border border-white/20"
              >
                Back to Course
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Quiz Start Screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Brain className="h-16 w-16 text-yellow-400" />
              <Award className="h-16 w-16 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              {moduleId === 'final' ? 'AI-Generated Final Examination' : 'AI-Generated Module Quiz'}
            </h1>
            <p className="text-gray-300 mb-8">
              This quiz has been automatically generated from your PDF content using advanced AI technology.
            </p>

            <div className="bg-white/5 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center mb-6">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                  quiz.isAI 
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' 
                    : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                }`}>
                  {quiz.isAI ? '✨ AI-Generated Assessment' : '📚 Standard Assessment (AI Offline)'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{quiz.questions.length}</h3>
                  <p className="text-gray-400">AI Questions</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{quiz.timeLimit}</h3>
                  <p className="text-gray-400">Minutes</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{quiz.passingScore}%</h3>
                  <p className="text-gray-400">Passing Score</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 mb-8">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="h-5 w-5 text-blue-400" />
                <p className="text-blue-300 font-semibold">AI-Powered Assessment</p>
              </div>
              <p className="text-blue-200 text-sm">
                This quiz was intelligently generated by analyzing your PDF content. Questions are designed to test 
                your understanding of the key concepts and practical applications covered in the material.
              </p>
            </div>

            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-8">
              <p className="text-yellow-300 text-sm">
                <strong>Instructions:</strong> You have {quiz.timeLimit} minutes to complete this quiz. 
                Make sure you have a stable internet connection. You need {quiz.passingScore}% to pass.
              </p>
            </div>

            <div className="flex flex-col gap-4 mx-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startQuiz}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 mx-auto w-full"
              >
                <Brain className="h-5 w-5" />
                <span>Start Quiz</span>
              </motion.button>

              {!quiz.isAI && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setLoading(true);
                    const type = moduleId === 'final' ? 'final' : 'module';
                    axios.get(`http://localhost:5000/api/quiz/${courseId}/${moduleId}?type=${type}&regenerate=true`)
                      .then(res => {
                        setQuiz(res.data);
                        setLoading(false);
                        if (res.data.isAI) {
                          alert('Successfully generated new questions with AI!');
                        } else {
                          alert('AI is still unavailable. Please try again later.');
                        }
                      })
                      .catch(err => {
                        console.error(err);
                        setLoading(false);
                        alert('Failed to regenerate quiz.');
                      });
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 border border-white/20 flex items-center justify-center space-x-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Try Regenerating with AI</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Quiz Interface
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="h-6 w-6 text-yellow-400" />
                <h1 className="text-2xl font-bold text-white">
                  {moduleId === 'final' ? 'AI Final Examination' : 'AI Module Quiz'}
                </h1>
              </div>
              <p className="text-gray-300">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-5 w-5 text-yellow-400" />
                <span className={`text-lg font-bold ${timeLeft < 300 ? 'text-red-400' : 'text-white'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="w-32 bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-emerald-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-6">
            {quiz.questions[currentQuestion].question}
          </h2>

          <div className="space-y-4">
            {quiz.questions[currentQuestion].options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleAnswerSelect(currentQuestion, index)}
                className={`w-full text-left p-4 rounded-lg border transition-all duration-300 ${
                  answers[currentQuestion] === index
                    ? 'bg-yellow-500/20 border-yellow-400 text-white'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQuestion] === index
                      ? 'border-yellow-400 bg-yellow-400'
                      : 'border-gray-400'
                  }`}>
                    {answers[currentQuestion] === index && (
                      <CheckCircle className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
          >
            Previous
          </button>

          <div className="flex items-center space-x-4">
            {currentQuestion < quiz.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={submitting || answers.some(answer => answer === null)}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Award className="h-5 w-5" />
                    <span>Submit Quiz</span>
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;