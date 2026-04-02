import React, { useState } from 'react';
import axios from 'axios';
import './SubmitProject.css';
import idealogo from '../assets/idealogo.png';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SubmitProject() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    student_id: '',
    title: '',
    description: '',
    category: '',
    features: '',
    problem_statement: '',
    solution_statement: '',
    keywords: [],
    deployment_time: '',
    supervisor: '',
    technologies_used: [],
    required_resources: '',
    proposed_budget: '',
    srs_document:  '',
    ui_ux_preview:  '',
    additional_files:  '',
    presentation_proposal:  '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle tag-based input for Keywords & Technologies Used
  const handleTagInput = (e, fieldName) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const value = e.target.value.trim();
      if (value) {
        setFormData((prev) => ({
          ...prev,
          [fieldName]: [...prev[fieldName], value],
        }));
        e.target.value = ''; // Clear input field after adding tag
      }
    }
  };

  // Remove a keyword or technology
  const handleRemoveTag = (fieldName, index) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index),
    }));
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
  
    const formPayload = new FormData();
  
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formPayload.append(key, value.join(',')); // Convert array to comma-separated string ✅
      } else if (value !== null && value !== undefined) {
        formPayload.append(key, value);
      }
    });
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/student/project/submit', formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      // Show success toast notification
      toast.success(response.data.message || 'Project submitted successfully!', {
        position: "top-right",
        autoClose: 3000, // Auto close after 3 seconds
      });
  
      // Reload the page after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
  
    } catch (error) {
      console.error('Submission error:', error.response?.data);
  
      if (error.response && error.response.status === 422) {
        // Laravel validation errors
        const errors = error.response.data.errors;
        const errorMessages = Object.keys(errors)
          .map((field) => ` ${errors[field][0]}`)
          .join('\n');
  
        // Show error toast notification
        toast.error(errorMessages, {
          position: "top-right",
          autoClose: 5000, // Auto close after 5 seconds
        });
  
      } else {
        // Show general error toast notification
        toast.error(error.response?.data?.message || 'Error submitting project.', {
          position: "top-right",
          autoClose: 5000, // Auto close after 5 seconds
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/student');
  };

  const renderProgressBar = () => {
    return (
      <div className="progress-bar">
        {[1, 2, 3, 4, 5].map((stepNumber) => (
          <div 
            key={stepNumber} 
            className={`progress-step ${step >= stepNumber ? 'active' : ''}`}
          >
            <div className="step-number">{stepNumber}</div>
            <div className="step-label">
              {stepNumber === 1 && "Basic Info"}
              {stepNumber === 2 && "Project Details"}
              {stepNumber === 3 && "Solution"}
              {stepNumber === 4 && "Technical"}
              {stepNumber === 5 && "Documents"}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="submit-project-container">
      <ToastContainer />
      
      <div className="submit-project-header">
        <div className="submit-project-logo">
          <img src={idealogo} alt="IdeaFunder Logo" />
        </div>
        <h2>Submit a New Project</h2>
      </div>
      
      {renderProgressBar()}

      {isLoading && <p className="info-message">Submitting your project...</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="submit-project-form">
        {step === 1 && (
          <div className="form-step">
            <h3>Basic Information</h3>
            <div className="form-group">
              <label htmlFor="student_id">Student ID</label>
              <input 
                type="text" 
                id="student_id"
                name="student_id" 
                placeholder="Enter your student ID" 
                value={formData.student_id} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="title">Project Title</label>
              <input 
                type="text" 
                id="title"
                name="title" 
                placeholder="Enter your project title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Project Description</label>
              <textarea 
                id="description"
                name="description" 
                placeholder="Describe your project" 
                value={formData.description} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-navigation">
              <button type="button" onClick={nextStep} className="btn-next">Next</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-step">
            <h3>Project Details</h3>
            <div className="form-group">
              <label htmlFor="category">Project Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="category-filter"
                required
              >
                <option value="">-- Select Category --</option>
                
                <optgroup label="Development">
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile App Development">Mobile App Development</option>
                  <option value="Game Development">Game Development</option>
                </optgroup>

                <optgroup label="Artificial Intelligence">
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Deep Learning">Deep Learning</option>
                  <option value="Computer Vision">Computer Vision</option>
                  <option value="NLP">Natural Language Processing</option>
                </optgroup>

                <optgroup label="Systems & Security">
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Operating Systems">Operating Systems</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                </optgroup>

                <optgroup label="Data">
                  <option value="Data Science">Data Science</option>
                  <option value="Big Data">Big Data</option>
                  <option value="Data Visualization">Data Visualization</option>
                </optgroup>

                <optgroup label="Emerging Tech">
                  <option value="Blockchain">Blockchain</option>
                  <option value="IoT">Internet of Things</option>
                  <option value="AR/VR">Augmented & Virtual Reality</option>
                </optgroup>

                <optgroup label="Others">
                  <option value="Research">Research</option>
                  <option value="Business">Business</option>
                  <option value="Software">Software</option>
                  <option value="Hardware">Hardware</option>
                </optgroup>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="features">Key Features</label>
              <textarea
                id="features"
                name="features"
                placeholder="List the main features of your project"
                value={formData.features}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="problem_statement">Problem Statement</label>
              <textarea
                id="problem_statement"
                name="problem_statement"
                placeholder="Describe the problem your project solves"
                value={formData.problem_statement}
                onChange={handleChange}
              />
            </div>

            <div className="form-navigation">
              <button type="button" onClick={prevStep} className="btn-prev">Back</button>
              <button type="button" onClick={nextStep} className="btn-next">Next</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-step">
            <h3>Solution Information</h3>
            <div className="form-group">
              <label htmlFor="solution_statement">Solution Statement</label>
              <textarea 
                id="solution_statement"
                name="solution_statement" 
                placeholder="Describe how your project solves the problem" 
                value={formData.solution_statement} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group">
              <label htmlFor="keywords">Keywords</label>
              <div className="tag-input">
                <input 
                  type="text" 
                  id="keywords"
                  placeholder="Enter keywords & press Enter" 
                  onKeyDown={(e) => handleTagInput(e, 'keywords')} 
                />
                <div className="tags">
                  {formData.keywords.map((keyword, index) => (
                    <span key={index} className="tag">
                      {keyword} <span className="remove-tag" onClick={() => handleRemoveTag('keywords', index)}>×</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="deployment_time">Deployment Time (days)</label>
              <input 
                type="number" 
                id="deployment_time"
                name="deployment_time" 
                placeholder="Estimated days to deploy" 
                value={formData.deployment_time} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-navigation">
              <button type="button" onClick={prevStep} className="btn-prev">Back</button>
              <button type="button" onClick={nextStep} className="btn-next">Next</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="form-step">
            <h3>Technical Details</h3>
            <div className="form-group">
              <label htmlFor="supervisor">Project Supervisor</label>
              <input 
                type="text" 
                id="supervisor"
                name="supervisor" 
                placeholder="Name of your project supervisor" 
                value={formData.supervisor} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group">
              <label htmlFor="technologies">Technologies Used</label>
              <div className="tag-input">
                <input 
                  type="text" 
                  id="technologies"
                  placeholder="Enter technologies & press Enter" 
                  onKeyDown={(e) => handleTagInput(e, 'technologies_used')} 
                />
                <div className="tags">
                  {formData.technologies_used.map((tech, index) => (
                    <span key={index} className="tag">
                      {tech} <span className="remove-tag" onClick={() => handleRemoveTag('technologies_used', index)}>×</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="required_resources">Required Resources</label>
              <textarea 
                id="required_resources"
                name="required_resources" 
                placeholder="List the resources needed for your project" 
                value={formData.required_resources} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group">
              <label htmlFor="proposed_budget">Proposed Budget ($)</label>
              <input 
                type="number" 
                id="proposed_budget"
                step="0.01" 
                name="proposed_budget" 
                placeholder="Estimated budget for your project" 
                value={formData.proposed_budget} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-navigation">
              <button type="button" onClick={prevStep} className="btn-prev">Back</button>
              <button type="button" onClick={nextStep} className="btn-next">Next</button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="form-step">
            <h3>Project Documents</h3>
            <div className="form-group file-upload">
              <label htmlFor="srs_document">SRS Document (PDF)</label>
              <input 
                type="file" 
                id="srs_document"
                name="srs_document" 
                accept=".pdf" 
                onChange={handleChange} 
              />
              <div className="file-info">Software Requirements Specification document</div>
            </div>
            
            <div className="form-group file-upload">
              <label htmlFor="ui_ux_preview">UI/UX Preview (Image)</label>
              <input 
                type="file" 
                id="ui_ux_preview"
                name="ui_ux_preview" 
                accept=".jpg,.png,.jpeg" 
                onChange={handleChange} 
              />
              <div className="file-info">Screenshots or mockups of your interface</div>
            </div>
            
            <div className="form-group file-upload">
              <label htmlFor="additional_files">Additional Files (ZIP/RAR)</label>
              <input 
                type="file" 
                id="additional_files"
                name="additional_files" 
                accept=".zip,.rar" 
                onChange={handleChange} 
              />
              <div className="file-info">Any supplementary files for your project</div>
            </div>
            
            <div className="form-group file-upload">
              <label htmlFor="presentation_proposal">Presentation Proposal (PPT, PPTX)</label>
              <input 
                type="file" 
                id="presentation_proposal"
                name="presentation_proposal" 
                accept=".ppt,.pptx" 
                onChange={handleChange} 
              />
              <div className="file-info">Project presentation slides</div>
            </div>

            <div className="form-navigation">
              <button type="button" onClick={prevStep} className="btn-prev">Back</button>
              <button type="submit" disabled={isLoading} className="btn-submit">
                {isLoading ? 'Submitting...' : 'Submit Project'}
              </button>
            </div>
          </div>
        )}
      </form>
      
      <div className="dashboard-navigation">
        <button onClick={handleBackToDashboard} className="back-button">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default SubmitProject;