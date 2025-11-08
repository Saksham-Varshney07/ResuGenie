import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FinalCV.css";

const FinalCV = ({ resumeData }) => {
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState("pdf");

  const handleBack = () => navigate("/preview");
  const handleStartOver = () => navigate("/form");
  const handlePrint = () => window.print();

  // ✅ Real Download Logic (PDF & DOCX)
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const token = localStorage.getItem("token");

      // Always include `credentials: "include"` to avoid CORS issues
      const response = await fetch(
        `http://localhost:5000/api/resume/${downloadFormat}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Download failed: ${errorText}`);
      }

      // ✅ Convert response to Blob and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resume.${downloadFormat}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      console.log(`✅ ${downloadFormat.toUpperCase()} file downloaded successfully`);
    } catch (error) {
      console.error("❌ Error downloading resume:", error);
      alert("Failed to download resume. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const formatSkills = (skillsString) =>
    skillsString
      ? skillsString.split(",").map((skill) => skill.trim()).filter(Boolean)
      : [];

  return (
    <div className="final-page">
      {/* Navigation Bar */}
      <div className="navigation">
        <div className="container nav-content">
          <div className="logo">AI Resume Builder</div>
          <div className="nav-steps">
            <span className="nav-step completed">Form</span>
            <span className="nav-step completed">Preview</span>
            <span className="nav-step active">Final</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: "100%" }}></div>
      </div>

      {/* Main Container */}
      <div className="container">
        <div className="final-header">
          <h1 className="page-title">🎉 Your Resume is Ready!</h1>
          <p className="page-subtitle">
            Your professional resume has been generated successfully
          </p>
        </div>

        <div className="final-layout">
          {/* Left Sidebar - Actions */}
          <div className="final-actions-card">
            <h3>Download Options</h3>
            <div className="download-options">
              <div className="format-selector">
                <label className="format-option">
                  <input
                    type="radio"
                    name="format"
                    value="pdf"
                    checked={downloadFormat === "pdf"}
                    onChange={(e) => setDownloadFormat(e.target.value)}
                  />
                  <span className="format-label">
                    <span className="format-icon">📄</span>
                    PDF Format
                  </span>
                </label>
                <label className="format-option">
                  <input
                    type="radio"
                    name="format"
                    value="docx"
                    checked={downloadFormat === "docx"}
                    onChange={(e) => setDownloadFormat(e.target.value)}
                  />
                  <span className="format-label">
                    <span className="format-icon">📝</span>
                    Word Document
                  </span>
                </label>
              </div>

              <div className="action-buttons">
                <button
                  className={`btn btn-primary download-btn ${
                    isDownloading ? "loading" : ""
                  }`}
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  {isDownloading
                    ? "Generating..."
                    : `Download ${downloadFormat.toUpperCase()}`}
                </button>

                <button className="btn btn-secondary" onClick={handlePrint}>
                  🖨️ Print Resume
                </button>
              </div>
            </div>

            <div className="additional-actions">
              <button className="btn btn-secondary" onClick={handleBack}>
                ← Back to Preview
              </button>
              <button className="btn btn-secondary" onClick={handleStartOver}>
                🔄 Create New Resume
              </button>
            </div>

            <div className="success-features">
              {[
                ["✅", "ATS-Friendly Format"],
                ["🎨", "Professional Design"],
                ["📱", "Mobile Optimized"],
                ["🚀", "Ready to Apply"],
              ].map(([icon, text]) => (
                <div key={text} className="feature-item">
                  <span className="feature-icon">{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Resume Preview */}
          <div className="final-preview">
            <div className="resume-final" id="resume-final">
              {/* Header */}
              <div className="resume-header">
                <h1 className="resume-name">
                  {resumeData.personalInfo.fullName || "Your Name"}
                </h1>
                <div className="resume-contact">
                  {resumeData.personalInfo.email && (
                    <span className="contact-item">
                      📧 {resumeData.personalInfo.email}
                    </span>
                  )}
                  {resumeData.personalInfo.phone && (
                    <span className="contact-item">
                      📱 {resumeData.personalInfo.phone}
                    </span>
                  )}
                  {resumeData.personalInfo.address && (
                    <span className="contact-item">
                      📍 {resumeData.personalInfo.address}
                    </span>
                  )}
                  {resumeData.personalInfo.linkedin && (
                    <span className="contact-item">
                      💼{" "}
                      <a
                        href={resumeData.personalInfo.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LinkedIn
                      </a>
                    </span>
                  )}
                  {resumeData.personalInfo.website && (
                    <span className="contact-item">
                      🌐{" "}
                      <a
                        href={resumeData.personalInfo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Website
                      </a>
                    </span>
                  )}
                </div>
              </div>

              {/* Summary */}
              {resumeData.summary && (
                <div className="resume-section">
                  <h2 className="section-title">Professional Summary</h2>
                  <p className="summary-text">{resumeData.summary}</p>
                </div>
              )}

              {/* Experience */}
              {resumeData.experience?.length > 0 && (
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
                          {formatDate(exp.startDate)} -{" "}
                          {exp.current
                            ? "Present"
                            : formatDate(exp.endDate)}
                        </div>
                      </div>
                      {exp.description && (
                        <p className="experience-description">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Education */}
              {resumeData.education?.length > 0 && (
                <div className="resume-section">
                  <h2 className="section-title">Education</h2>
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="education-item">
                      <div className="education-header">
                        <div>
                          <h3 className="degree-title">
                            {edu.degree} in {edu.field}
                          </h3>
                          <h4 className="institution-name">
                            {edu.institution}
                          </h4>
                        </div>
                        <div className="date-range">
                          {formatDate(edu.startDate)} -{" "}
                          {formatDate(edu.endDate)}
                        </div>
                      </div>
                      {edu.gpa && <p className="gpa">GPA: {edu.gpa}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}
              {resumeData.skills?.length > 0 && (
                <div className="resume-section">
                  <h2 className="section-title">Skills</h2>
                  <div className="skills-grid">
                    {resumeData.skills.map((skillCategory, index) => (
                      <div key={index} className="skill-category">
                        <h4 className="skill-category-title">
                          {skillCategory.category}
                        </h4>
                        <div className="skill-items">
                          {formatSkills(skillCategory.items).map(
                            (skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="skill-tag"
                              >
                                {skill}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {resumeData.projects?.length > 0 && (
                <div className="resume-section">
                  <h2 className="section-title">Projects</h2>
                  {resumeData.projects.map((project, index) => (
                    <div key={index} className="project-item">
                      <div className="project-header">
                        <h3 className="project-title">
                          {project.link ? (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {project.name}
                            </a>
                          ) : (
                            project.name
                          )}
                        </h3>
                      </div>
                      {project.technologies && (
                        <div className="project-technologies">
                          <strong>Technologies:</strong>{" "}
                          {project.technologies}
                        </div>
                      )}
                      {project.description && (
                        <p className="project-description">
                          {project.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalCV;
