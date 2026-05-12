import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, BookOpen, ChevronDown, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const AIStudyAssistant = ({ activeModule, course, onClose, user }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const messagesEndRef = useRef(null);

  // Initial greeting
  useEffect(() => {
    if (activeModule && user) {
      setMessages([
        {
          role: 'model',
          content: `Hi ${user.name}! I've read "${activeModule.name}". Ask me anything about the content, or click 'Quiz me' to test your knowledge.`,
          isInitial: true
        }
      ]);
      setQuizData(null);
      setSelectedAnswer(null);
    }
  }, [activeModule, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, quizData]);

  const handleSend = async (textOverride = null) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || !activeModule) return;

    const newMessages = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Check if it's a quiz request
      if (textToSend.toLowerCase().includes('quiz me') || textToSend.toLowerCase().includes('quiz')) {
        const response = await axios.post(
          'http://localhost:5000/api/assistant/quickquiz',
          { moduleId: activeModule._id },
          { headers }
        );
        
        setQuizData(response.data);
        setIsTyping(false);
        return;
      }

      // Normal chat request
      // Cap history at 10 to send to backend (handled on backend, but we send what we have)
      const response = await axios.post(
        'http://localhost:5000/api/assistant/chat',
        { 
          moduleId: activeModule._id,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })) 
        },
        { headers }
      );

      setMessages(prev => [...prev, { role: 'model', content: response.data.reply }]);
    } catch (error) {
      console.error('Assistant error:', error);
      setMessages(prev => [
        ...prev, 
        { 
          role: 'model', 
          content: error.response?.data?.error || "I'm having trouble connecting right now. Please try again later.",
          isError: true
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuizAnswer = (optionKey) => {
    if (selectedAnswer) return; // Prevent multiple selections
    setSelectedAnswer(optionKey);

    const isCorrect = optionKey === quizData.answer;
    
    // Add explanation as a new message after a short delay
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          role: 'model',
          content: `${isCorrect ? 'Correct!' : 'Not quite.'} ${quizData.explanation}`
        }
      ]);
      setQuizData(null);
      setSelectedAnswer(null);
    }, 1500);
  };

  if (!activeModule) return null;

  return (
    <div className="flex flex-col h-full w-full bg-gray-900 rounded-xl overflow-hidden">
      {/* Context Bar */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 px-4 py-2 flex justify-between items-center text-xs">
        <div className="flex items-center space-x-2 text-purple-200">
          <BookOpen className="w-4 h-4" />
          <span className="truncate max-w-[200px]">Reading: {activeModule.name}</span>
        </div>
        <div className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full flex items-center space-x-1 border border-emerald-500/30">
          <Sparkles className="w-3 h-3" />
          <span>Grounded in PDF</span>
        </div>
        {/* Mobile close button could go here if needed, triggering onClose */}
        {onClose && (
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
            <ChevronDown className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Chat Header */}
      <div className="bg-gray-800 p-4 flex items-center space-x-3 border-b border-gray-700">
        <div className="relative">
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center border-2 border-gray-800 z-10 relative">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-gray-800 z-20"></div>
        </div>
        <div>
          <h3 className="text-white font-bold text-sm">ILPS Study Assistant</h3>
          <p className="text-gray-400 text-xs">Answers from your course material only</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px]">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 ${msg.role === 'user' ? 'bg-indigo-600 ml-2' : 'bg-gray-700 mr-2'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-gray-300" />}
              </div>
              
              <div className="flex flex-col">
                <div className={`p-3 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-purple-600 text-white rounded-tr-sm' 
                    : msg.isError 
                      ? 'bg-red-900/50 text-red-200 border border-red-800 rounded-tl-sm'
                      : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-sm'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
                
                {msg.role === 'model' && !msg.isError && (
                  <div className="mt-1 flex items-center text-[10px] text-gray-500 ml-1">
                    <span className="bg-gray-800 px-2 py-0.5 rounded-full border border-gray-700">
                      Source: {activeModule.name} PDF
                    </span>
                  </div>
                )}
                
                {/* Suggestions for initial message */}
                {msg.isInitial && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button 
                      onClick={() => handleSend(`Explain the main topic of ${activeModule.name}`)}
                      className="text-xs bg-gray-800 hover:bg-gray-700 text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded-full transition-colors"
                    >
                      Explain main topic
                    </button>
                    <button 
                      onClick={() => handleSend("What are the key concepts?")}
                      className="text-xs bg-gray-800 hover:bg-gray-700 text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded-full transition-colors"
                    >
                      What are the key concepts?
                    </button>
                    <button 
                      onClick={() => handleSend("Quiz me")}
                      className="text-xs bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-full transition-colors flex items-center space-x-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Quiz me</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Inline Quiz Card */}
        {quizData && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start mb-4"
          >
            <div className="flex max-w-[90%] flex-row">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center mt-1 mr-2">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              
              <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-tl-sm p-4 w-full">
                <p className="text-sm text-white font-medium mb-4">{quizData.question}</p>
                <div className="space-y-2">
                  {Object.entries(quizData.options).map(([key, value]) => {
                    let btnClass = "bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-200";
                    let icon = null;

                    if (selectedAnswer) {
                      if (key === quizData.answer) {
                        btnClass = "bg-emerald-900/50 border-emerald-500 text-emerald-200";
                        icon = <CheckCircle className="w-4 h-4 text-emerald-500" />;
                      } else if (key === selectedAnswer) {
                        btnClass = "bg-red-900/50 border-red-500 text-red-200";
                        icon = <XCircle className="w-4 h-4 text-red-500" />;
                      } else {
                        btnClass = "bg-gray-800 border-gray-700 text-gray-500 opacity-50";
                      }
                    }

                    return (
                      <button
                        key={key}
                        disabled={!!selectedAnswer}
                        onClick={() => handleQuizAnswer(key)}
                        className={`w-full text-left p-3 rounded-lg border text-sm transition-all duration-300 flex justify-between items-center ${btnClass}`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="font-bold w-6 text-center">{key}</span>
                          <span>{value}</span>
                        </div>
                        {icon}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex flex-row">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-2">
                <Bot className="w-5 h-5 text-gray-300" />
              </div>
              <div className="bg-gray-800 border border-gray-700 p-4 rounded-2xl rounded-tl-sm flex items-center space-x-2">
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-2 h-2 bg-gray-400 rounded-full" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 bg-gray-400 rounded-full" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 bg-gray-400 rounded-full" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Row */}
      <div className="p-3 bg-gray-800 border-t border-gray-700 flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question about this module..."
          className="flex-1 bg-gray-900 border border-gray-600 rounded-full px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          disabled={isTyping || selectedAnswer !== null && quizData !== null}
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isTyping}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white p-2.5 rounded-full transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AIStudyAssistant;
