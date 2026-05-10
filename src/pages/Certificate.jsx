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
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const userRes = await axios.get('http://localhost:5000/api/auth/me', { headers });
      setUser(userRes.data);
      
      const certRes = await axios.get(`http://localhost:5000/api/certificate/${userRes.data.id}/${courseId}`, { headers });
      setCourse(certRes.data); // certRes.data contains courseName, avgQuizScore etc.
    } catch (error) {
      console.error('Error fetching certificate data:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = () => {
    window.print();
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
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #certificate-container, #certificate-container * {
              visibility: visible;
            }
            #certificate-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              padding: 0;
            }
          }
        `}
      </style>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 print:hidden"
        >
          <Award className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-emerald-400">Certificate</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Congratulations on completing the course! Download your certificate below.
          </p>
        </motion.div>

        {/* Certificate Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          id="certificate-container"
          className="bg-white text-gray-900 rounded-lg p-12 border-[12px] border-double border-yellow-500 mb-8 relative overflow-hidden"
          style={{ minHeight: '600px' }}
        >
          {/* Decorative Elements */}
          <div className="absolute top-4 left-4 w-16 h-16 border-4 border-yellow-400/30 rounded-full"></div>
          <div className="absolute top-4 right-4 w-16 h-16 border-4 border-emerald-400/30 rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 border-4 border-purple-400/30 rounded-full"></div>
          <div className="absolute bottom-4 right-4 w-12 h-12 border-4 border-blue-400/30 rounded-full"></div>
          
          <div className="text-center relative z-10 flex flex-col items-center h-full justify-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
              Certificate of Completion
            </h2>
            
            <p className="text-xl text-gray-600 mb-6">This is to certify that</p>
            
            <h3 className="text-4xl md:text-5xl font-bold text-yellow-600 mb-6" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              {course?.studentName || user?.name}
            </h3>
            
            <p className="text-xl text-gray-600 mb-6">has successfully completed the course</p>
            
            <h4 className="text-2xl md:text-3xl font-bold text-emerald-700 mb-8 max-w-2xl">
              {course?.courseName}
            </h4>
            
            <div className="flex items-center justify-center space-x-12 mb-8">
              <div className="flex flex-col items-center">
                <span className="text-gray-800 font-semibold border-b border-gray-400 pb-1 px-4 mb-2">
                  {course?.issuedAt ? new Date(course.issuedAt).toLocaleDateString() : new Date().toLocaleDateString()}
                </span>
                <span className="text-sm text-gray-500">Date Issued</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-gray-800 font-semibold border-b border-gray-400 pb-1 px-4 mb-2">
                  {course?.avgQuizScore}%
                </span>
                <span className="text-sm text-gray-500">Avg Quiz Score</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-gray-800 font-semibold border-b border-gray-400 pb-1 px-4 mb-2" style={{ fontFamily: 'cursive' }}>
                  ILPS Admin
                </span>
                <span className="text-sm text-gray-500">Signature</span>
              </div>
            </div>
            
            <div className="text-xl font-bold text-gray-800 tracking-widest mt-4">
              INTERACTIVE LEARNING PATHWAY SYSTEM
            </div>
            <div className="mt-8 text-sm text-gray-500 font-mono">
              Certificate Code: {course?.certificateCode}
            </div>
          </div>
        </motion.div>

        {/* Download Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center print:hidden"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadCertificate}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-3 mx-auto"
          >
            <Download className="h-6 w-6" />
            <span>Download as PDF</span>
          </motion.button>
          
          <p className="text-gray-400 text-sm mt-4">
            Clicking this will open the print dialog. Save as PDF to keep your certificate.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Certificate;