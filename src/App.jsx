import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Courses from './pages/Courses';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CourseDetail from './pages/CourseDetail';
import AdminPanel from './pages/AdminPanel';
import AddCourse from './pages/AddCourse';
import UpdateCourse from './pages/UpdateCourse';
import DeleteCourse from './pages/DeleteCourse';
import Quiz from './pages/Quiz';
import Certificate from './pages/Certificate';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-emerald-900">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/course/:id" 
              element={
                <ProtectedRoute>
                  <CourseDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-panel" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/add-course" 
              element={
                <ProtectedRoute adminOnly>
                  <AddCourse />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/update-course" 
              element={
                <ProtectedRoute adminOnly>
                  <UpdateCourse />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/delete-course" 
              element={
                <ProtectedRoute adminOnly>
                  <DeleteCourse />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quiz/:courseId/:moduleId" 
              element={
                <ProtectedRoute>
                  <Quiz />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/certificate/:courseId" 
              element={
                <ProtectedRoute>
                  <Certificate />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;