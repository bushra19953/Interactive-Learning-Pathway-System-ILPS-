import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Award, Calendar, User } from 'lucide-react';
import axios from 'axios';

const Certificate = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificateData();
  }, [courseId]);

  const fetchCertificateData = async () => {
    try {
      const [courseRes, userRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/courses/${courseId}`),
        axios.get('http://localhost:5000/api/auth/me')
      ]);
      
      setCourse(courseRes.data);
      setUser(userRes.data);
    } catch (error) {
      console.error('Error fetching certificate data:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = () => {
    // In a real implementation, this would generate and download a PDF certificate
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 1200;
    canvas.height = 800;
    
    // Background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Border
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
    
    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Certificate of Completion', canvas.width / 2, 150);
    
    // Subtitle
    ctx.font = '24px Arial';
    ctx.fillStyle = '#d1d5db';
    ctx.fillText('This is to certify that', canvas.width / 2, 220);
    
    // Student Name
    ctx.font = 'bold 36px Arial';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(user?.name || 'Student Name', canvas.width / 2, 300);
    
    // Course completion text
    ctx.font = '24px Arial';
    ctx.fillStyle = '#d1d5db';
    ctx.fillText('has successfully completed the course', canvas.width / 2, 360);
    
    // Course Name
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = '#10b981';
    ctx.fillText(course?.name || 'Course Name', canvas.width / 2, 420);
    
    // Date
    ctx.font = '20px Arial';
    ctx.fillStyle = '#d1d5db';
    ctx.fillText(`Completed on ${new Date().toLocaleDateString()}`, canvas.width / 2, 500);
    
    // ILPS Logo/Text
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('Interactive Learning Pathway System', canvas.width / 2, 600);
    
    // Download
    const link = document.createElement('a');
    link.download = `${course?.name || 'Course'}_Certificate.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

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
          <Award className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-emerald-400">Certificate</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Congratulations on completing the course! Download your certificate below.
          </p>
        </motion.div>

        {/* Certificate Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gradient-to-br from-purple-900/50 to-emerald-900/50 backdrop-blur-sm rounded-2xl p-12 border-4 border-yellow-400/50 mb-8 relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-4 left-4 w-16 h-16 border-4 border-yellow-400/30 rounded-full"></div>
          <div className="absolute top-4 right-4 w-16 h-16 border-4 border-emerald-400/30 rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 border-4 border-purple-400/30 rounded-full"></div>
          <div className="absolute bottom-4 right-4 w-12 h-12 border-4 border-blue-400/30 rounded-full"></div>
          
          <div className="text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Certificate of Completion
            </h2>
            
            <p className="text-xl text-gray-300 mb-6">This is to certify that</p>
            
            <h3 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-emerald-400 mb-6">
              {user?.name}
            </h3>
            
            <p className="text-xl text-gray-300 mb-6">has successfully completed the course</p>
            
            <h4 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400 mb-8">
              {course?.name}
            </h4>
            
            <div className="flex items-center justify-center space-x-8 mb-8">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">ILPS Certified</span>
              </div>
            </div>
            
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-purple-400">
              Interactive Learning Pathway System
            </div>
          </div>
        </motion.div>

        {/* Course Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8"
        >
          <h3 className="text-2xl font-bold text-white mb-6">Course Achievement Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-emerald-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Award className="h-8 w-8 text-emerald-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Course Completed</h4>
              <p className="text-gray-300">{course?.name}</p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-8 w-8 text-yellow-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Completion Date</h4>
              <p className="text-gray-300">{new Date().toLocaleDateString()}</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <User className="h-8 w-8 text-purple-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Certified By</h4>
              <p className="text-gray-300">ILPS Platform</p>
            </div>
          </div>
        </motion.div>

        {/* Download Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadCertificate}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-3 mx-auto"
          >
            <Download className="h-6 w-6" />
            <span>Download Certificate</span>
          </motion.button>
          
          <p className="text-gray-400 text-sm mt-4">
            Your certificate will be downloaded as a high-quality image file.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Certificate;