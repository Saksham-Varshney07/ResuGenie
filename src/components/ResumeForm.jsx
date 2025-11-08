import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ResumeForm.css';

const ResumeForm = ({ resumeData, updateResumeData }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentSection, setCurrentSection] = useState('personal');
  const [formData, setFormData] = useState(
    resumeData || {
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        address: '',
        linkedin: '',
        website: '',
      },
      summary: '',
      experience: [],
      education: [],
      skills: [],
      projects: [],
    }
  );
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Fetch resume data from backend
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("⚠️ No token found in localStorage.");
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        const res = await fetch("http://localhost:5000/api/resume/get", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("❌ Failed to fetch resume:", res.status);
          setIsLoading(false);
          return;
        }

        const data = await res.json();
        console.log("✅ Resume data fetched:", data);

        // ✅ Always set structured data safely
        setFormData({
          personalInfo: {
            fullName: data.personalInfo?.fullName || '',
            email: data.personalInfo?.email || '',
            phone: data.personalInfo?.phone || '',
            address: data.personalInfo?.address || '',
            linkedin: data.personalInfo?.linkedin || '',
            website: data.personalInfo?.website || '',
          },
          summary: data.summary || '',
          experience: Array.isArray(data.experience) ? data.experience : [],
          education: Array.isArray(data.education) ? data.education : [],
          skills: Array.isArray(data.skills) ? data.skills : [],
          projects: Array.isArray(data.projects) ? data.projects : [],
        });

        setIsLoading(false);
      } catch (err) {
        console.error("⚠️ Error fetching resume:", err);
        setIsLoading(false);
      }
    };

    fetchResume();
  }, [location.pathname]);

  // ✅ Save resume data to backend
  const handleSaveResume = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('⚠️ No token found. Please log in again.');
      return;
    }

    try {
      console.log('💾 Saving resume data...', formData);

      const response = await fetch('http://localhost:5000/api/resume/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Resume saved successfully:', result);
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to save resume:', errorText);
      }
    } catch (error) {
      console.error('⚠️ Error saving resume:', error);
    }
  };

  const handleNext = async () => {
    await handleSaveResume();
    updateResumeData(formData);
    navigate('/preview');
  };

  // ✅ Input helpers
  const handleInputChange = (section, field, value, index = null) => {
    setFormData(prev => {
      if (index !== null) {
        const newArray = [...prev[section]];
        newArray[index] = { ...newArray[index], [field]: value };
        return { ...prev, [section]: newArray };
      } else if (section === 'personalInfo') {
        return {
          ...prev,
          personalInfo: { ...prev.personalInfo, [field]: value },
        };
      } else {
        return { ...prev, [field]: value };
      }
    });
  };

  const addArrayItem = (section, template) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], template],
    }));
  };

  const removeArrayItem = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  // ✅ Section Renderers
  const renderPersonalInfo = () => (
    <div className="form-section">
      <h3>Personal Information</h3>
      <div className="form-grid">
        {[
          ['Full Name *', 'fullName', 'text', 'John Doe'],
          ['Email *', 'email', 'email', 'john@example.com'],
          ['Phone', 'phone', 'tel', '+1 (555) 123-4567'],
          ['Address', 'address', 'text', 'City, State, Country'],
          ['LinkedIn', 'linkedin', 'url', 'https://linkedin.com/in/johndoe'],
          ['Website', 'website', 'url', 'https://johndoe.com'],
        ].map(([label, field, type, placeholder]) => (
          <div className="form-group" key={field}>
            <label className="form-label">{label}</label>
            <input
              type={type}
              className="form-input"
              value={formData.personalInfo[field]}
              onChange={(e) =>
                handleInputChange('personalInfo', field, e.target.value)
              }
              placeholder={placeholder}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="form-section">
      <h3>Professional Summary</h3>
      <textarea
        className="form-input form-textarea"
        value={formData.summary}
        onChange={(e) => handleInputChange(null, 'summary', e.target.value)}
        rows="6"
        placeholder="Write a brief professional summary..."
      />
    </div>
  );

  // ✅ Experience
  const renderExperience = () => (
    <div className="form-section">
      <h3>Work Experience</h3>
      <button
        type="button"
        className="btn btn-secondary add-btn"
        onClick={() =>
          addArrayItem('experience', {
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            current: false,
            description: '',
          })
        }
      >
        + Add Experience
      </button>

      {formData.experience.map((exp, index) => (
        <div key={index} className="array-item">
          <h4>Experience {index + 1}</h4>
          <input
            type="text"
            className="form-input"
            placeholder="Company"
            value={exp.company}
            onChange={(e) =>
              handleInputChange('experience', 'company', e.target.value, index)
            }
          />
          <input
            type="text"
            className="form-input"
            placeholder="Position"
            value={exp.position}
            onChange={(e) =>
              handleInputChange('experience', 'position', e.target.value, index)
            }
          />
          <textarea
            className="form-input form-textarea"
            placeholder="Description..."
            value={exp.description}
            onChange={(e) =>
              handleInputChange('experience', 'description', e.target.value, index)
            }
          />
          <button
            className="remove-btn"
            onClick={() => removeArrayItem('experience', index)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );

  // ✅ Education
  const renderEducation = () => (
    <div className="form-section">
      <h3>Education</h3>
      <button
        type="button"
        className="btn btn-secondary add-btn"
        onClick={() =>
          addArrayItem('education', {
            institution: '',
            degree: '',
            field: '',
            startDate: '',
            endDate: '',
            gpa: '',
          })
        }
      >
        + Add Education
      </button>

      {formData.education.map((edu, index) => (
        <div key={index} className="array-item">
          <h4>Education {index + 1}</h4>
          <input
            type="text"
            className="form-input"
            placeholder="Institution"
            value={edu.institution}
            onChange={(e) =>
              handleInputChange('education', 'institution', e.target.value, index)
            }
          />
          <input
            type="text"
            className="form-input"
            placeholder="Degree"
            value={edu.degree}
            onChange={(e) =>
              handleInputChange('education', 'degree', e.target.value, index)
            }
          />
          <input
            type="text"
            className="form-input"
            placeholder="Field of Study"
            value={edu.field}
            onChange={(e) =>
              handleInputChange('education', 'field', e.target.value, index)
            }
          />
          <button
            className="remove-btn"
            onClick={() => removeArrayItem('education', index)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );

  // ✅ Skills
  const renderSkills = () => (
    <div className="form-section">
      <h3>Skills</h3>
      <button
        type="button"
        className="btn btn-secondary add-btn"
        onClick={() => addArrayItem('skills', { category: '', items: '' })}
      >
        + Add Skill Category
      </button>

      {formData.skills.map((skill, index) => (
        <div key={index} className="array-item">
          <input
            type="text"
            className="form-input"
            placeholder="Category"
            value={skill.category}
            onChange={(e) =>
              handleInputChange('skills', 'category', e.target.value, index)
            }
          />
          <input
            type="text"
            className="form-input"
            placeholder="Skills (comma-separated)"
            value={skill.items}
            onChange={(e) =>
              handleInputChange('skills', 'items', e.target.value, index)
            }
          />
          <button
            className="remove-btn"
            onClick={() => removeArrayItem('skills', index)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );

  // ✅ Projects
  const renderProjects = () => (
    <div className="form-section">
      <h3>Projects</h3>
      <button
        type="button"
        className="btn btn-secondary add-btn"
        onClick={() =>
          addArrayItem('projects', {
            name: '',
            description: '',
            technologies: '',
            link: '',
          })
        }
      >
        + Add Project
      </button>

      {formData.projects.map((project, index) => (
        <div key={index} className="array-item">
          <input
            type="text"
            className="form-input"
            placeholder="Project Name"
            value={project.name}
            onChange={(e) =>
              handleInputChange('projects', 'name', e.target.value, index)
            }
          />
          <textarea
            className="form-input form-textarea"
            placeholder="Description"
            value={project.description}
            onChange={(e) =>
              handleInputChange('projects', 'description', e.target.value, index)
            }
          />
          <input
            type="text"
            className="form-input"
            placeholder="Technologies"
            value={project.technologies}
            onChange={(e) =>
              handleInputChange('projects', 'technologies', e.target.value, index)
            }
          />
          <input
            type="url"
            className="form-input"
            placeholder="Project Link"
            value={project.link}
            onChange={(e) =>
              handleInputChange('projects', 'link', e.target.value, index)
            }
          />
          <button
            className="remove-btn"
            onClick={() => removeArrayItem('projects', index)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );

  // ✅ Section Switcher
  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'personal': return renderPersonalInfo();
      case 'summary': return renderSummary();
      case 'experience': return renderExperience();
      case 'education': return renderEducation();
      case 'skills': return renderSkills();
      case 'projects': return renderProjects();
      default: return renderPersonalInfo();
    }
  };

  // ✅ Final JSX
  return (
    <div className="resume-form-page">
      <div className="navigation">
        <div className="container nav-content">
          <div className="logo">AI Resume Builder</div>
          <div className="nav-steps">
            <span className="nav-step active">Form</span>
            <span className="nav-step inactive">Preview</span>
            <span className="nav-step inactive">Final</span>
          </div>
        </div>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: '33%' }}></div>
      </div>

      <div className="container">
        {isLoading ? (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading your saved resume...</div>
        ) : (
          <div className="form-layout">
            <div className="form-sidebar">
              <h3>Sections</h3>
              <nav className="section-nav">
                {[
                  { id: 'personal', title: 'Personal Info', icon: '👤' },
                  { id: 'summary', title: 'Summary', icon: '📝' },
                  { id: 'experience', title: 'Experience', icon: '💼' },
                  { id: 'education', title: 'Education', icon: '🎓' },
                  { id: 'skills', title: 'Skills', icon: '⚡' },
                  { id: 'projects', title: 'Projects', icon: '🚀' },
                ].map(section => (
                  <button
                    key={section.id}
                    className={`section-nav-item ${currentSection === section.id ? 'active' : ''}`}
                    onClick={() => setCurrentSection(section.id)}
                  >
                    <span className="section-icon">{section.icon}</span>
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>

            <div className="form-main">
              <div className="form-container">
                {renderCurrentSection()}
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNext}
                  >
                    Continue to Preview →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeForm;
