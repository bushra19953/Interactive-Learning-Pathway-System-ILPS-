import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Trash2, BookOpen, Upload, Save } from 'lucide-react';
import axios from 'axios';

const AddCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    courseId: '',
    name: '',
    description: '',
    thumbnail: null,
    certificateImage: null,
    modules: [{ name: '', file: null }]
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleModuleChange = (index, field, value) => {
    const updatedModules = formData.modules.map((mod, i) => 
      i === index ? { ...mod, [field]: value } : mod
    );
    setFormData({
      ...formData,
      modules: updatedModules
    });
  };

  const addModule = () => {
    setFormData({
      ...formData,
      modules: [...formData.modules, { name: '', file: null }]
    });
  };

  const removeModule = (index) => {
    if (formData.modules.length > 1) {
      const updatedModules = formData.modules.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        modules: updatedModules
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate modules
    for (let i = 0; i < formData.modules.length; i++) {
      const module = formData.modules[i];
      if (!module.name.trim()) {
        alert(`Module ${i + 1} name is required`);
        setLoading(false);
        return;
      }
      if (!module.file) {
        alert(`Module ${i + 1} PDF file is required`);
        setLoading(false);
        return;
      }
    }

    const submitData = new FormData();
    const dataPayload = {
      courseId: formData.courseId,
      name: formData.name,
      description: formData.description,
      modules: formData.modules.map((m, index) => ({ name: m.name, order: index + 1 }))
    };
    
    console.log('Sending dataPayload:', dataPayload);
    submitData.append('data', JSON.stringify(dataPayload));
    
    if (formData.thumbnail) {
      console.log('Adding thumbnail:', formData.thumbnail.name);
      submitData.append('thumbnail', formData.thumbnail);
    }
    if (formData.certificateImage) {
      console.log('Adding certificateImage:', formData.certificateImage.name);
      submitData.append('certificateImage', formData.certificateImage);
    }
    
    formData.modules.forEach((module, index) => {
      console.log(`Adding module ${index} file:`, module.file?.name);
      submitData.append(`moduleFile_${index}`, module.file);
    });

    try {
      const response = await axios.post('http://localhost:5000/api/admin/courses', submitData);
      alert('Course created successfully!');
      navigate('/admin-panel');
    } catch (error) {
      console.error('Error creating course:', error);
      alert(error.response?.data?.message || 'Error creating course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <BookOpen className="h-10 w-10 text-emerald-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Add New <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-yellow-400">Course</span>
            </h1>
          </div>
          <p className="text-gray-300">Create a comprehensive learning experience for your students</p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="courseId" className="block text-sm font-medium text-gray-300 mb-2">
                  Course ID *
                </label>
                <input
                  type="text"
                  id="courseId"
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300"
                  placeholder="e.g., REACT-101"
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Course Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300"
                  placeholder="e.g., React Fundamentals"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Course Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 resize-none"
                placeholder="Describe what students will learn in this course..."
              />
            </div>

            {/* Media Files */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-300 mb-2">
                  Thumbnail Image Path
                </label>
                <div className="relative">
                  <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="file"
                    id="thumbnail"
                    name="thumbnail"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="certificateImage" className="block text-sm font-medium text-gray-300 mb-2">
                  Certificate Image Path
                </label>
                <div className="relative">
                  <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="file"
                    id="certificateImage"
                    name="certificateImage"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Modules Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Course Modules</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={addModule}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Module</span>
                </motion.button>
              </div>

              <div className="space-y-4">
                {formData.modules.map((module, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/5 rounded-lg p-6 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-white">Module {index + 1}</h4>
                      {formData.modules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeModule(index)}
                          className="text-red-400 hover:text-red-300 transition-colors duration-200"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Module Name *
                        </label>
                        <input
                          type="text"
                          value={module.name}
                          onChange={(e) => handleModuleChange(index, 'name', e.target.value)}
                          required
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300"
                          placeholder="e.g., Introduction to React"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          PDF File *
                        </label>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => handleModuleChange(index, 'file', e.target.files[0])}
                          required
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-all duration-300"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Create Course</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddCourse;