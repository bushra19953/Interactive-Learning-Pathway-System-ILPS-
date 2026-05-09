import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Search, AlertTriangle, Key } from 'lucide-react';
import axios from 'axios';

const DeleteCourse = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/admin/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setShowConfirmation(false);
    setAdminKey('');
  };

  const handleDeleteRequest = () => {
    if (!selectedCourse) return;
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    if (!adminKey.trim()) {
      alert('Please enter the admin key');
      return;
    }

    setDeleting(true);
    try {
      await axios.delete(`http://localhost:5000/api/admin/courses/${selectedCourse._id}`, {
        data: { adminKey }
      });
      
      alert('Course deleted successfully!');
      fetchCourses();
      setSelectedCourse(null);
      setShowConfirmation(false);
      setAdminKey('');
    } catch (error) {
      console.error('Error deleting course:', error);
      alert(error.response?.data?.message || 'Error deleting course. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.courseId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Trash2 className="h-10 w-10 text-red-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Delete <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Course</span>
            </h1>
          </div>
          <p className="text-gray-300">Permanently remove courses from the platform</p>
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mt-4 max-w-2xl mx-auto">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <p className="text-red-300 text-sm">
                <strong>Warning:</strong> This action cannot be undone. All course data, student progress, and certificates will be permanently deleted.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          >
            <h2 className="text-xl font-bold text-white mb-4">Select Course to Delete</h2>
            
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300"
              />
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-400 mx-auto"></div>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredCourses.map((course) => (
                  <motion.button
                    key={course._id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleCourseSelect(course)}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-300 ${
                      selectedCourse?._id === course._id
                        ? 'bg-red-500/20 border-red-400 text-white'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <h3 className="font-semibold mb-1">{course.name}</h3>
                    <p className="text-sm opacity-75">ID: {course.courseId}</p>
                    <p className="text-sm opacity-75">{course.modules?.length || 0} modules</p>
                    <p className="text-sm opacity-75">Created: {new Date(course.createdAt).toLocaleDateString()}</p>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Delete Confirmation */}
          <div className="lg:col-span-2">
            {selectedCourse ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Course Details</h2>
                
                {/* Course Information */}
                <div className="bg-white/5 rounded-lg p-6 border border-white/10 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="text-white font-semibold mb-2">Course Name</h3>
                      <p className="text-gray-300">{selectedCourse.name}</p>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Course ID</h3>
                      <p className="text-gray-300">{selectedCourse.courseId}</p>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Modules</h3>
                      <p className="text-gray-300">{selectedCourse.modules?.length || 0} modules</p>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Created</h3>
                      <p className="text-gray-300">{new Date(selectedCourse.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {selectedCourse.description && (
                    <div>
                      <h3 className="text-white font-semibold mb-2">Description</h3>
                      <p className="text-gray-300">{selectedCourse.description}</p>
                    </div>
                  )}
                </div>

                {!showConfirmation ? (
                  <div className="text-center">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDeleteRequest}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center space-x-2 mx-auto"
                    >
                      <Trash2 className="h-5 w-5" />
                      <span>Delete This Course</span>
                    </motion.button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/30 rounded-lg p-6"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <AlertTriangle className="h-6 w-6 text-red-400" />
                      <h3 className="text-xl font-bold text-red-300">Confirm Deletion</h3>
                    </div>
                    
                    <p className="text-red-200 mb-6">
                      You are about to permanently delete "<strong>{selectedCourse.name}</strong>". 
                      This action will remove all course content, student progress, and cannot be undone.
                    </p>

                    <div className="mb-6">
                      <label htmlFor="adminKey" className="block text-sm font-medium text-red-300 mb-2">
                        Enter Admin Key to Confirm *
                      </label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400 h-5 w-5" />
                        <input
                          type="password"
                          id="adminKey"
                          value={adminKey}
                          onChange={(e) => setAdminKey(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-red-900/20 border border-red-500/50 rounded-lg text-white placeholder-red-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300"
                          placeholder="Enter admin key"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleConfirmDelete}
                        disabled={deleting || !adminKey.trim()}
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {deleting ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <Trash2 className="h-5 w-5" />
                            <span>Confirm Delete</span>
                          </>
                        )}
                      </motion.button>
                      
                      <button
                        onClick={() => setShowConfirmation(false)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20 text-center"
              >
                <Trash2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Select a Course</h3>
                <p className="text-gray-400">Choose a course from the list to view its details and delete it.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteCourse;