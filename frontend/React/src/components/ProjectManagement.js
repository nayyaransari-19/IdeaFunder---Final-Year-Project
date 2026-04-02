import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaDownload } from "react-icons/fa";
import"./ProjectManagement.css"; // Reusing existing styles
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify and ToastContainer
import './UserManagement.css';

function ProjectManagement() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/projects");
                setProjects(response.data);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };

        fetchProjects();
    }, []);

    const constructFileUrl = (filePath) => {
        if (!filePath) return null;
        return `http://localhost/nayyar/done/ideafunder/storage/app/public/${filePath}`;
    };

    const handleViewProject = (project) => {
        setSelectedProject(project);
    };

    const handleDeleteProject = (id) => {
        const toastId = toast.info(
            <div style={{ textAlign: "center" }}>
                <p>Are you sure you want to delete this project?</p>
                <button 
                    onClick={async () => {
                        try {
                            await axios.delete(`http://127.0.0.1:8000/api/projects/${id}`);
                            setProjects((prevProjects) => prevProjects.filter((proj) => proj.id !== id));
                            toast.dismiss(toastId); // Dismiss the toast
                            toast.success('Project deleted successfully!');
                        } catch (error) {
                            toast.dismiss(toastId); // Dismiss the toast
                            toast.error("Failed to delete project.");
                        }
                    }} 
                    className="confirm-btn"
                    style={{
                        marginRight: "10px",
                        padding: "5px 10px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Confirm
                </button>
                <button 
                    onClick={() => toast.dismiss(toastId)} // Dismiss the toast on Cancel
                    className="cancel-btn"
                    style={{
                        padding: "5px 10px",
                        backgroundColor: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Cancel
                </button>
            </div>,
            { autoClose: false, closeButton: false }
        );
    };

    const handleBackToDashboard = () => {
        navigate('/admin'); // Replace with your admin dashboard route
    };
    return (
        <div className="approved-projects-container">
            <ToastContainer
    position="top-center" // Centered notifications
    autoClose={3000} // Closes after 3 seconds
    hideProgressBar={false}
    newestOnTop={true}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
/>

            
            <h3>Project Management</h3>
            {/* Back to Dashboard Button */}
            <div className="back-button-container">
                <button onClick={handleBackToDashboard} className="back-button">
                    Back to Dashboard
                </button></div>
            {selectedProject ? (
                <div className="adminshow-project-details">
                    <div className="adminshow-project-header">
                        <h4>{selectedProject.title}</h4>
                        
                    </div>

                    <div className="adminshow-project-body">
                        <p><strong>Student ID:</strong> {selectedProject.student_id || "N/A"}</p>
                        <p><strong>Description:</strong> {selectedProject.description || "N/A"}</p>
                        <p><strong>Features:</strong> {selectedProject.features || "N/A"}</p>
                        <p><strong>Problem Statement:</strong> {selectedProject.problem_statement || "N/A"}</p>
                        <p><strong>Solution Statement:</strong> {selectedProject.solution_statement || "N/A"}</p>
                        <p><strong>Keywords:</strong> {selectedProject.keywords || "N/A"}</p>
                        <p><strong>Category:</strong> {selectedProject.category || "N/A"}</p>
                        <p><strong>Deployment Time:</strong> {selectedProject.deployment_time || "N/A"} days</p>
                        <p><strong>Supervisor:</strong> {selectedProject.supervisor || "N/A"}</p>
                        <p><strong>Technologies Used:</strong> {selectedProject.technologies_used || "N/A"}</p>
                        <p><strong>Required Resources:</strong> {selectedProject.required_resources || "N/A"}</p>
                        <p><strong>Proposed Budget:</strong> ${selectedProject.proposed_budget || "N/A"}</p>

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
                <div className="manage-container">
                    {projects.length === 0 ? (
                        <p className="no-projects-message">No projects available.</p>
                    ) : (
                        <ul className="manage-list">
                            {projects.map((project) => (
                                <li key={project.id} className="manage-item">
                                    <div className="manage-info">
                                        <span className="manage-title">{project.title}</span>
                                        <span className="manage-student-id">Student ID: {project.student_id}</span>
                                        <span className="manage-status">
                                            Status: <strong>{project.status || "Pending"}</strong>
                                        </span>
                                        <span className="manage-time">
                                            Submitted On: <strong>{new Date(project.updated_at).toLocaleDateString()}</strong>
                                        </span>
                                    </div>
                                    <div className="manage-actions">
                                        <button onClick={() => handleViewProject(project)} className="manage-view-btn">View</button>
                                        <button onClick={() => handleDeleteProject(project.id)} className="manage-delete-btn">Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            )}
       
        </div>
    );
}



export default ProjectManagement;
