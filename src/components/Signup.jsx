import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // reuse same CSS for consistent styling

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (response.ok) {
        alert("✅ Account created successfully! Please log in.");
        navigate("/login");
      } else {
        alert(data.message || "❌ Signup failed");
      }
    } catch (error) {
      setIsLoading(false);
      alert("⚠️ Something went wrong. Please try again.");
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">AI Resume Builder</h1>
          <p className="login-subtitle">Create professional resumes with AI assistance</p>
        </div>

        <div className="login-card">
          <h2 className="login-form-title">Create Account</h2>
          <p className="login-form-subtitle">Sign up to start building your AI-powered resume</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className={`btn btn-primary login-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>

          <div className="login-footer">
            <p>Already have an account? <a href="/login" className="login-link">Sign in</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
