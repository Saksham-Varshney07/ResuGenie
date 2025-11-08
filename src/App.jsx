import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import FinalCV from './components/FinalCV';
import Signup from './components/Signup';  // ✅ imported signup
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      website: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: []
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const updateResumeData = (newData) => {
    setResumeData(prevData => ({
      ...prevData,
      ...newData
    }));
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 🔐 Login route */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
              <Navigate to="/form" replace /> : 
              <Login onLogin={handleLogin} />
            } 
          />

          {/* 🆕 Signup route */}
          <Route 
            path="/signup" 
            element={
              isAuthenticated ? 
              <Navigate to="/form" replace /> : 
              <Signup />
            } 
          />

          {/* Resume Form route */}
          <Route 
            path="/form" 
            element={
              isAuthenticated ? 
              <ResumeForm 
                resumeData={resumeData} 
                updateResumeData={updateResumeData} 
              /> : 
              <Navigate to="/login" replace />
            } 
          />

          {/* Preview route */}
          <Route 
            path="/preview" 
            element={
              isAuthenticated ? 
              <ResumePreview 
                resumeData={resumeData} 
                updateResumeData={updateResumeData} 
              /> : 
              <Navigate to="/login" replace />
            } 
          />

          {/* Final CV route */}
          <Route 
            path="/final" 
            element={
              isAuthenticated ? 
              <FinalCV resumeData={resumeData} /> : 
              <Navigate to="/login" replace />
            } 
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
