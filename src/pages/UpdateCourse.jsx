import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit, Search, Save, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';

const UpdateCourse = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
    setSelectedCourse({
      ...course,
      modules: course.modules || []
    });
  };

  const handleChange = (field, value) => {
    setSelectedCourse({
      ...selectedCourse,
      [field]: value
    });
  };

  const handleModuleChange = (index, field, value) => {
    const updatedModules = selectedCourse.modules.map((mod, i) => 
      i === index ? { ...mod, [field]: value } : mod
    );
    setSelectedCourse({
      ...selectedCourse,
      modules: updatedModules
    });
  };

  const addModule = () => {
    setSelectedCourse({
      ...selectedCourse,
      modules: [...selectedCourse.modules, { name: '', pdfPath: '', file: null }]
    });
  };

  const removeModule = (index) => {
    if (selectedCourse.modules.length > 1) {
      const updatedModules = selectedCourse.modules.filter((_, i) => i !== index);
      setSelectedCourse({
        ...selectedCourse,
        modules: updatedModules
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const submitData = new FormData();
      const dataPayload = {
        name: selectedCourse.name,
        description: selectedCourse.description,
        modules: selectedCourse.modules.map((m, index) => ({ name: m.name, order: index + 1, pdfPath: m.pdfPath }))
      };
      submitData.append('data', JSON.stringify(dataPayload));
      
      if (selectedCourse.thumbnailFile) submitData.append('thumbnail', selectedCourse.thumbnailFile);
      if (selectedCourse.certificateImageFile) submitData.append('certificateImage', selectedCourse.certificateImageFile);
      
      selectedCourse.modules.forEach((module, index) => {
        if (module.file) {
          submitData.append(`moduleFile_${index}`, module.file);
        }
      });

      await axios.put(`http://localhost:5000/api/admin/courses/${selectedCourse._id}`, submitData);
      
      alert('Course updated successfully!');
      fetchCourses();
      setSelectedCourse(null);
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Error updating course. Please try again.');
    } finally {
      setUpdating(false);
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
            <Edit className="h-10 w-10 text-blue-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Update <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Course</span>
            </h1>
          </div>
          <p className="text-gray-300">Select a course to modify its content and structure</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          >
            <h2 className="text-xl font-bold text-white mb-4">Select Course</h2>
            
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
              />
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
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
                        ? 'bg-blue-500/20 border-blue-400 text-white'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <h3 className="font-semibold mb-1">{course.name}</h3>
                    <p className="text-sm opacity-75">ID: {course.courseId}</p>
                    <p className="text-sm opacity-75">{course.modules?.length || 0} modules</p>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Update Form */}
          <div className="lg:col-span-2">
            {selectedCourse ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Update Course</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Course ID (Read-only)
                      </label>
                      <input
                        type="text"
                        value={selectedCourse.courseId}
                        disabled
                        className="w-full px-4 py-3 bg-gray-600/50 border border-gray-500 rounded-lg text-gray-400 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Course Name *
                      </label>
                      <input
                        type="text"
                        value={selectedCourse.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Course Description
                    </label>
                    <textarea
                      value={selectedCourse.description || ''}
                      onChange={(e) => handleChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 resize-none"
                    />
                  </div>

                  {/* Media Files */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Thumbnail Image (Upload new to replace)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleChange('thumbnailFile', e.target.files[0])}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-300"
                      />
                      {selectedCourse.thumbnail && <p className="text-gray-500 text-xs mt-1">Current: {selectedCourse.thumbnail}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Certificate Image (Upload new to replace)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleChange('certificateImageFile', e.target.files[0])}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-300"
                      />
                      {selectedCourse.certificateImage && <p className="text-gray-500 text-xs mt-1">Current: {selectedCourse.certificateImage}</p>}
                    </div>
                  </div>

                  {/* Modules */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Course Modules</h3>
                      <button
                        type="button"
                        onClick={addModule}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center space-x-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Module</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {selectedCourse.modules.map((module, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-white font-semibold">Module {index + 1}</h4>
                            {selectedCourse.modules.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeModule(index)}
                                className="text-red-400 hover:text-red-300 transition-colors duration-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              value={module.name}
                              onChange={(e) => handleModuleChange(index, 'name', e.target.value)}
                              placeholder="Module name"
                              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                            />
                            <div className="flex flex-col space-y-2">
                              <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => handleModuleChange(index, 'file', e.target.files[0])}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-300"
                              />
                              {module.pdfPath && <p className="text-gray-500 text-xs mt-1">Current: {module.pdfPath}</p>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={updating}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {updating ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Save className="h-5 w-5" />
                          <span>Update Course</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20 text-center"
              >
                <Edit className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Select a Course</h3>
                <p className="text-gray-400">Choose a course from the list to start updating its content.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCourse;