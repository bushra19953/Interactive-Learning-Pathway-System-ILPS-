import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import {
  BookOpen,
  Award,
  Clock,
  TrendingUp,
  User,
  Calendar,
  Target,
  ArrowRight,
  CheckCircle,
  PlayCircle
} from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [progress, setProgress] = useState({});
  const [stats, setStats] = useState({
    completedCourses: 0,
    totalModules: 0,
    certificatesEarned: 0,
    studyTime: 0
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [coursesRes, progressRes, statsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/user/enrolled-courses'),
        axios.get('http://localhost:5000/api/user/progress'),
        axios.get('http://localhost:5000/api/user/stats')
      ]);

      setEnrolledCourses(coursesRes.data);
      setProgress(progressRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const getProgressPercentage = (courseId) => {
    return progress[courseId]?.percentage || 0;
  };

  const quickStats = [
    {
      icon: BookOpen,
      title: 'Enrolled Courses',
      value: enrolledCourses.length,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      icon: CheckCircle,
      title: 'Completed',
      value: stats.completedCourses,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20'
    },
    {
      icon: Award,
      title: 'Certificates',
      value: stats.certificatesEarned,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    },
    {
      icon: Clock,
      title: 'Study Hours',
      value: stats.studyTime,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    }
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-emerald-400">{user?.name}</span>!
              </h1>
              <p className="text-gray-300 text-lg">Continue your learning journey and achieve your goals.</p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">{user?.name}</p>
                  <p className="text-gray-400 text-sm capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} rounded-lg p-3`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-gray-400 text-sm">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enrolled Courses */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Your Courses</h2>
                <Link
                  to="/courses"
                  className="text-yellow-400 hover:text-yellow-300 font-semibold text-sm flex items-center space-x-1 transition-colors duration-200"
                >
                  <span>Browse All</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {enrolledCourses.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Courses Yet</h3>
                  <p className="text-gray-400 mb-6">Start your learning journey by enrolling in a course.</p>
                  <Link
                    to="/courses"
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 inline-flex items-center space-x-2"
                  >
                    <BookOpen className="h-5 w-5" />
                    <span>Browse Courses</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrolledCourses
                    .filter(course => course) // ensures only non-null courses are processed
                    .map((course, index) => (
                      <motion.div
                        key={course._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <img
                              src={course.thumbnail || 'https://images.pexels.com/photos/6146929/pexels-photo-6146929.jpeg?auto=compress&cs=tinysrgb&w=100'}
                              alt={course.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div>
                              <h3 className="text-white font-semibold mb-1">{course.name}</h3>
                              <p className="text-gray-400 text-sm">{course.modules?.length || 0} modules</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <div className="w-32 bg-gray-700 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-yellow-400 to-emerald-400 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${getProgressPercentage(course._id)}%` }}
                                  ></div>
                                </div>
                                <span className="text-gray-400 text-sm">{getProgressPercentage(course._id)}%</span>
                              </div>
                            </div>
                          </div>
                          <Link
                            to={`/course/${course._id}`}
                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center space-x-2"
                          >
                            <PlayCircle className="h-4 w-4" />
                            <span>Continue</span>
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Learning Goals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Target className="h-6 w-6 text-yellow-400" />
                <h3 className="text-xl font-semibold text-white">This Week's Goals</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Complete 2 modules</span>
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Take 1 quiz</span>
                  <div className="w-5 h-5 border-2 border-gray-400 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Study 5 hours</span>
                  <div className="w-5 h-5 border-2 border-gray-400 rounded-full"></div>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="h-6 w-6 text-purple-400" />
                <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <div>
                    <p className="text-white text-sm">Completed Module 2</p>
                    <p className="text-gray-400 text-xs">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <div>
                    <p className="text-white text-sm">Started new course</p>
                    <p className="text-gray-400 text-xs">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div>
                    <p className="text-white text-sm">Earned certificate</p>
                    <p className="text-gray-400 text-xs">3 days ago</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;