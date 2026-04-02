import React, { useState, useEffect } from 'react';
import './ApprovedProjects.css';
import { FaDownload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
function ApprovedProjects() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApprovedProjects = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/approved-projects');
                if (!response.ok) {
                    throw new Error('Failed to fetch approved projects.');
                }
                const data = await response.json();
                setProjects(data);
            } catch (error) {
                console.error('Error fetching approved projects:', error);
            }
            
        };

        fetchApprovedProjects();
        console.log("useEffect has run!");
    }, []);
  

    const constructFileUrl = (filePath) => {
        if (!filePath) return null;
        return `http://localhost/nayyar/done/ideafunder/storage/app/public/${filePath}`;
    };

    const handleViewProject = (project) => {
        setSelectedProject(project);
    };
    const handleBackToDashboard = () => {
        navigate('/admin'); // Replace with your admin dashboard route
    };

    return (
        <div className="approved-projects-container">
            
            
            <h3>Approved Projects</h3>

            {selectedProject ? (
                <div className="adminshow-project-details">
                    <div className="adminshow-project-header">
                        <h4>{selectedProject.title}</h4>
                        
                    </div>

                    <div className="adminshow-project-body">
                        <p><strong>Student ID:</strong> {selectedProject.student_id}</p>
                        <p><strong>Description:</strong> {selectedProject.description}</p>
                        <p><strong>Features:</strong> {selectedProject.features || 'N/A'}</p>
                        <p><strong>Problem Statement:</strong> {selectedProject.problem_statement || 'N/A'}</p>
                        <p><strong>Solution Statement:</strong> {selectedProject.solution_statement || 'N/A'}</p>
                        <p><strong>Keywords:</strong> {selectedProject.keywords || 'N/A'}</p>
                        <p><strong>Category:</strong> {selectedProject.category}</p>
                        <p><strong>Deployment Time:</strong> {selectedProject.deployment_time || 'N/A'} days</p>
                        <p><strong>Supervisor:</strong> {selectedProject.supervisor || 'N/A'}</p>
                        <p><strong>Technologies Used:</strong> {selectedProject.technologies_used || 'N/A'}</p>
                        <p><strong>Required Resources:</strong> {selectedProject.required_resources || 'N/A'}</p>
                        <p><strong>Proposed Budget:</strong> ${selectedProject.proposed_budget || 'N/A'}</p>

                        <div className="adminshow-project-files">
                            <div>
                                <strong>SRS Document:</strong>
                                <a href={constructFileUrl(selectedProject.srs_document)} target="_blank" rel="noopener noreferrer">
                                    <FaDownload className="file-icon" /> SRS Document
                                </a>
                            </div>

                            <div className="ui-ux-preview-container">
                                <span className="preview-label">UI/UX Preview</span>
                                <img src={constructFileUrl(selectedProject.ui_ux_preview)} alt="UI/UX Preview" />
                            </div>

                            <div>
                                <strong>Additional Files:</strong>
                                <a href={constructFileUrl(selectedProject.additional_files)} target="_blank" rel="noopener noreferrer">
                                    <FaDownload className="file-icon" /> Additional Files
                                </a>
                            </div>

                            <div>
                                <strong>Presentation Proposal:</strong>
                                <a href={constructFileUrl(selectedProject.presentation_proposal)} target="_blank" rel="noopener noreferrer">
                                    <FaDownload className="file-icon" /> Presentation Proposal
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="adminshow-project-actions">
                        <button className="back-btn" onClick={() => setSelectedProject(null)}>Back to List</button>
                    </div>
                </div>
            ) : (
                <ul className="project-list">
                    {projects.length === 0 ? (
                        <p>No approved projects available.</p>
                    ) : (
                        projects.map(project => (
                            <li key={project.id}>
                                <span>{project.title}</span>
                                <span>Student ID: {project.student_id}</span>
                                <button onClick={() => handleViewProject(project)}>View</button>
                            </li>
                        ))
                    )}
                </ul>
            )}
            {/* Back to Dashboard Button */}
            <div className="back-button-container">
                <button onClick={handleBackToDashboard} className="back-button">
                    Back to Dashboard
                </button>
                </div>
        </div>
    );
}

export default ApprovedProjects;
