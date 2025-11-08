import React from 'react'
import { useNavigate } from 'react-router-dom'
import './ResumePreview.css'

const ResumePreview = ({ resumeData, updateResumeData }) => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/form')
  }

  const handleNext = () => {
    navigate('/final')
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const formatSkills = (skillsString) => {
    if (!skillsString) return []
    return skillsString.split(',').map(skill => skill.trim()).filter(skill => skill)
  }

  return (
    <div className="preview-page">
      <div className="navigation">
        <div className="container nav-content">
          <div className="logo">AI Resume Builder</div>
          <div className="nav-steps">
            <span className="nav-step completed">Form</span>
            <span className="nav-step active">Preview</span>
            <span className="nav-step inactive">Final</span>
          </div>
        </div>
      </div>
      
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: '66%' }}></div>
      </div>

      <div className="container">
        <div className="preview-header">
          <h1 className="page-title">Resume Preview</h1>
          <p className="page-subtitle">Review your resume and make any final adjustments</p>
        </div>

        <div className="preview-layout">
          <div className="preview-actions">
            <button className="btn btn-secondary" onClick={handleBack}>
              ← Back to Edit
            </button>
            <button className="btn btn-primary" onClick={handleNext}>
              Generate Final CV →
            </button>
          </div>

          <div className="resume-preview">
            <div className="resume-paper">
              {/* Header Section */}
              <div className="resume-header">
                <h1 className="resume-name">{resumeData.personalInfo.fullName || 'Your Name'}</h1>
                <div className="resume-contact">
                  {resumeData.personalInfo.email && (
                    <span className="contact-item">📧 {resumeData.personalInfo.email}</span>
                  )}
                  {resumeData.personalInfo.phone && (
                    <span className="contact-item">📱 {resumeData.personalInfo.phone}</span>
                  )}
                  {resumeData.personalInfo.address && (
                    <span className="contact-item">📍 {resumeData.personalInfo.address}</span>
                  )}
                  {resumeData.personalInfo.linkedin && (
                    <span className="contact-item">
                      💼 <a href={resumeData.personalInfo.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    </span>
                  )}
                  {resumeData.personalInfo.website && (
                    <span className="contact-item">
                      🌐 <a href={resumeData.personalInfo.website} target="_blank" rel="noopener noreferrer">Website</a>
                    </span>
                  )}
                </div>
              </div>

              {/* Summary Section */}
              {resumeData.summary && (
                <div className="resume-section">
                  <h2 className="section-title">Professional Summary</h2>
                  <p className="summary-text">{resumeData.summary}</p>
                </div>
              )}

              {/* Experience Section */}
              {resumeData.experience && resumeData.experience.length > 0 && (
                <div className="resume-section">
                  <h2 className="section-title">Work Experience</h2>
                  {resumeData.experience.map((exp, index) => (
                    <div key={index} className="experience-item">
                      <div className="experience-header">
                        <div>
                          <h3 className="position-title">{exp.position}</h3>
                          <h4 className="company-name">{exp.company}</h4>
                        </div>
                        <div className="date-range">
                          {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                        </div>
                      </div>
                      {exp.description && (
                        <p className="experience-description">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Education Section */}
              {resumeData.education && resumeData.education.length > 0 && (
                <div className="resume-section">
                  <h2 className="section-title">Education</h2>
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="education-item">
                      <div className="education-header">
                        <div>
                          <h3 className="degree-title">{edu.degree} in {edu.field}</h3>
                          <h4 className="institution-name">{edu.institution}</h4>
                        </div>
                        <div className="date-range">
                          {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                        </div>
                      </div>
                      {edu.gpa && (
                        <p className="gpa">GPA: {edu.gpa}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Skills Section */}
              {resumeData.skills && resumeData.skills.length > 0 && (
                <div className="resume-section">
                  <h2 className="section-title">Skills</h2>
                  <div className="skills-grid">
                    {resumeData.skills.map((skillCategory, index) => (
                      <div key={index} className="skill-category">
                        <h4 className="skill-category-title">{skillCategory.category}</h4>
                        <div className="skill-items">
                          {formatSkills(skillCategory.items).map((skill, skillIndex) => (
                            <span key={skillIndex} className="skill-tag">{skill}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects Section */}
              {resumeData.projects && resumeData.projects.length > 0 && (
                <div className="resume-section">
                  <h2 className="section-title">Projects</h2>
                  {resumeData.projects.map((project, index) => (
                    <div key={index} className="project-item">
                      <div className="project-header">
                        <h3 className="project-title">
                          {project.link ? (
                            <a href={project.link} target="_blank" rel="noopener noreferrer">{project.name}</a>
                          ) : (
                            project.name
                          )}
                        </h3>
                      </div>
                      {project.technologies && (
                        <div className="project-technologies">
                          <strong>Technologies:</strong> {project.technologies}
                        </div>
                      )}
                      {project.description && (
                        <p className="project-description">{project.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="preview-actions">
            <button className="btn btn-secondary" onClick={handleBack}>
              ← Back to Edit
            </button>
            <button className="btn btn-primary" onClick={handleNext}>
              Generate Final CV →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumePreview
