import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  Award, 
  Play,
  Lock,
  CheckCircle,
  FileText,
  Download,
  ExternalLink
} from 'lucide-react';
import axios from 'axios';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/courses/${id}`);
      setCourse(response.data);
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await axios.post(`http://localhost:5000/api/courses/${id}/enroll`);
      fetchCourse(); // Refresh course data
    } catch (error) {
      console.error('Error enrolling:', error);
    } finally {
      setEnrolling(false);
    }
  };

  const isModuleUnlocked = (moduleIndex) => {
    if (!course.isEnrolled) return false;
    if (moduleIndex === 0) return true;
    
    const previousModule = course.modules[moduleIndex - 1];
    return course.completedModules.some(
      completed => completed.moduleId === previousModule._id && completed.quizScore >= 70
    );
  };

  const isModuleCompleted = (moduleId) => {
    return course.completedModules.some(
      completed => completed.moduleId === moduleId && completed.quizScore >= 70
    );
  };

  const handleViewPDF = (pdfPath) => {
    // Create the full URL for the PDF
    const pdfUrl = `http://localhost:5000/${pdfPath}`;
    window.open(pdfUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Course Not Found</h2>
          <Link to="/courses" className="text-yellow-400 hover:text-yellow-300">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-4xl font-bold text-white mb-4">{course.name}</h1>
              <p className="text-gray-300 text-lg mb-6">
                {course.description || "Master the fundamentals and advanced concepts with our comprehensive, hands-on curriculum designed by industry experts."}
              </p>
              
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-yellow-400" />
                  <span className="text-gray-300">{course.modules.length} Modules</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-emerald-400" />
                  <span className="text-gray-300">Self-paced</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-purple-400" />
                  <span className="text-gray-300">Certificate</span>
                </div>
              </div>

              {course.isEnrolled && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">Progress</span>
                    <span className="text-yellow-400 font-semibold">{course.userProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-emerald-400 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${course.userProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <img
                src={course.thumbnail ? `http://localhost:5000/${course.thumbnail}` : 'https://images.pexels.com/photos/6146929/pexels-photo-6146929.jpeg?auto=compress&cs=tinysrgb&w=500'}
                alt={course.name}
                className="w-full h-64 object-cover rounded-xl mb-6"
              />
              
              {!course.isEnrolled ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {enrolling ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Play className="h-5 w-5" />
                      <span>Enroll Now</span>
                    </>
                  )}
                </motion.button>
              ) : (
                <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-lg p-4 text-center">
                  <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-emerald-300 font-semibold">Enrolled</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Course Modules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Course Modules</h2>
          
          <div className="space-y-4">
            {course.modules.map((module, index) => {
              const isUnlocked = isModuleUnlocked(index);
              const isCompleted = isModuleCompleted(module._id);
              
              return (
                <motion.div
                  key={module._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`bg-white/5 rounded-lg p-6 border border-white/10 ${
                    isUnlocked ? 'hover:bg-white/10' : 'opacity-60'
                  } transition-all duration-300`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isCompleted 
                          ? 'bg-emerald-500/20 border-2 border-emerald-400' 
                          : isUnlocked 
                            ? 'bg-yellow-500/20 border-2 border-yellow-400'
                            : 'bg-gray-500/20 border-2 border-gray-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="h-6 w-6 text-emerald-400" />
                        ) : isUnlocked ? (
                          <Play className="h-6 w-6 text-yellow-400" />
                        ) : (
                          <Lock className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          Module {index + 1}: {module.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {isCompleted ? 'Completed' : isUnlocked ? 'Available' : 'Locked'}
                        </p>
                        {module.pdfPath && (
                          <p className="text-gray-500 text-xs mt-1">
                            PDF: {module.pdfPath.split('/').pop()}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {isUnlocked && module.pdfPath && (
                        <button
                          onClick={() => handleViewPDF(module.pdfPath)}
                          className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center space-x-2"
                        >
                          <FileText className="h-4 w-4" />
                          <span>View PDF</span>
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      )}
                      
                      {isUnlocked && (
                        <Link
                          to={`/quiz/${course._id}/${module._id}`}
                          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center space-x-2"
                        >
                          <Award className="h-4 w-4" />
                          <span>Take Quiz</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Final Exam */}
          {course.isEnrolled && course.userProgress === 100 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 bg-gradient-to-r from-purple-600/20 to-emerald-600/20 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Final Examination</h3>
                  <p className="text-gray-300">
                    Complete the final exam to earn your certificate
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Link
                    to={`/quiz/${course._id}/final`}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2"
                  >
                    <Award className="h-5 w-5" />
                    <span>Take Final Exam</span>
                  </Link>
                  <Link
                    to={`/certificate/${course._id}`}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2"
                  >
                    <Download className="h-5 w-5" />
                    <span>Get Certificate</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CourseDetail;