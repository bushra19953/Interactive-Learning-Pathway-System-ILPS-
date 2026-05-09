import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  Plus, 
  Edit, 
  Trash2, 
  BookOpen, 
  Users, 
  Award,
  TrendingUp,
  Settings,
  RefreshCw
} from 'lucide-react';

const AdminPanel = () => {
  const adminActions = [
    {
      title: 'Add Course',
      description: 'Create a new course with modules and content',
      icon: Plus,
      link: '/add-course',
      color: 'from-emerald-500 to-emerald-600',
      hoverColor: 'from-emerald-600 to-emerald-700'
    },
    {
      title: 'Update Course',
      description: 'Modify existing course content and structure',
      icon: Edit,
      link: '/update-course',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'from-blue-600 to-blue-700'
    },
    {
      title: 'Delete Course',
      description: 'Remove courses from the platform',
      icon: Trash2,
      link: '/delete-course',
      color: 'from-red-500 to-red-600',
      hoverColor: 'from-red-600 to-red-700'
    }
  ];

  const [dashboardData, setDashboardData] = useState({
    totalCourses: 0,
    activeStudents: 0,
    certificatesIssued: 0,
    completionRate: '0%',
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/admin/metrics', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } // If needed, ensure auth is sent
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching admin metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const stats = [
    {
      title: 'Total Courses',
      value: dashboardData.totalCourses,
      icon: BookOpen,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Active Students',
      value: dashboardData.activeStudents,
      icon: Users,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20'
    },
    {
      title: 'Certificates Issued',
      value: dashboardData.certificatesIssued,
      icon: Award,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    },
    {
      title: 'Course Completion Rate',
      value: dashboardData.completionRate,
      icon: TrendingUp,
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
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Settings className="h-12 w-12 text-yellow-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-emerald-400">Panel</span>
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Manage courses, monitor student progress, and maintain the learning platform.
          </p>
        </motion.div>

        <div className="flex justify-end mb-6">
          <button 
            onClick={fetchMetrics} 
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
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

        {/* Admin Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Course Management</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {adminActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  to={action.link}
                  className="block group"
                >
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                    <div className={`w-16 h-16 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:${action.hoverColor} transition-all duration-300`}>
                      <action.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                      {action.title}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {action.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
          
          <div className="space-y-4">
            {dashboardData.recentActivity.length === 0 ? (
              <p className="text-gray-400">No recent activity.</p>
            ) : (
              dashboardData.recentActivity.map((activity, idx) => {
                let iconColor = 'bg-gray-400';
                if (activity.type === 'enrollment') iconColor = 'bg-emerald-400';
                if (activity.type === 'course_created') iconColor = 'bg-blue-400';
                if (activity.type === 'certificate_issued') iconColor = 'bg-yellow-400';
                if (activity.type === 'quiz_completed') iconColor = 'bg-purple-400';

                return (
                  <div key={idx} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className={`w-2 h-2 ${iconColor} rounded-full`}></div>
                    <div className="flex-1">
                      <p className="text-white">{activity.description}</p>
                      <p className="text-gray-400 text-sm">{new Date(activity.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;