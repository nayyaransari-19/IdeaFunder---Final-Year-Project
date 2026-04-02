import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import './AdminShow.css';
import logo from '../assets/logo.png';
import { FaUserCog, FaProjectDiagram, FaCheckCircle, FaEnvelope, FaExclamationCircle, FaQuestionCircle, FaTachometerAlt, FaDownload, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

function AdminDashboard() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [totalProjects, setTotalProjects] = useState(0);
    const [pendingProjects, setPendingProjects] = useState(0);
    const [approvedProjects, setApprovedProjects] = useState(0);
    
    const [notifications, setNotifications] = useState([
        { title: "New Project Submitted", message: "A new project has been submitted for review." },
        { title: "Project Approved", message: "Project 'AI Research' has been approved successfully." },
        { title: "User Complaint", message: "A new complaint has been received from Student 2112201." },
        { title: "Budget Update", message: "Project 'Green Energy' budget has been revised." },
        { title: "System Maintenance", message: "Scheduled maintenance at 10:00 PM tonight." }
    ]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        navigate('/signin');
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/admin/dashboard');
                if (!response.ok) {
                    throw new Error('Failed to fetch data.');
                }
                const data = await response.json();
                setTotalProjects(data.totalProjects);
                setPendingProjects(data.pendingProjects);
                setApprovedProjects(data.approvedProjects);
                setProjects(data.projects);
            } catch (error) {
                toast.error('Error fetching dashboard data: ' + error.message);
            }
        };

        const token = localStorage.getItem('token');
    if (!token) {
        navigate('/signin'); // Redirect to login page if no token is found
    }

        

        fetchDashboardData();
    }, []);

    const handleViewProject = (project) => {
        setSelectedProject(project);
    };

    const handleApprove = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/admin/projects/${id}/approve`, {
                method: 'PUT',
            });

            if (!response.ok) {
                throw new Error('Failed to approve project.');
            }

            const data = await response.json();
            toast.success(data.message || 'Project approved successfully!');
            setProjects(projects.filter(project => project.id !== id));
            setSelectedProject(null);
        } catch (error) {
            toast.error('Error approving project: ' + error.message);
        }
    };

    const handleReject = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/admin/projects/${id}/reject`, {
                method: 'PUT',
            });

            if (!response.ok) {
                throw new Error('Failed to reject project.');
            }

            const data = await response.json();
            toast.success(data.message || 'Project rejected successfully!');
            setProjects(projects.filter(project => project.id !== id));
            setSelectedProject(null);
        } catch (error) {
            toast.error('Error rejecting project: ' + error.message);
        }
    };

    const constructFileUrl = (filePath) => {
        if (!filePath) return null;
        return `http://localhost/nayyar/done/ideafunder/storage/app/public/${filePath}`;
    };


    return (
        <div className="admin-dashboard-container">
             {/* Toastify Container */}
             <ToastContainer 
                position="top-center"
                autoClose={3000} 
                hideProgressBar={false} 
                closeOnClick
                pauseOnHover
                draggable
            />
            {!selectedProject && (
                <aside className="admin-sidebar">
                    <nav className="admin-sidebar-nav">
                        <ul>
                            <li className="admin-sidebar-logo">
                                <img src={logo} alt="Idea Funder Logo" className="admin-logo" />
                                <span className="admin-logo-text">Idea Funder</span>
                            </li>
                            
                            <li><button onClick={() => navigate('/admin/user-management')}><FaUserCog size={16} /> User Management</button></li>
                            <li><button onClick={() => navigate('/admin/project-management')}><FaProjectDiagram size={16} /> Project Management</button></li>
                            <li><button onClick={() => navigate('/admin/approved-projects')}><FaCheckCircle size={16} /> Approved Projects</button></li>
                            <li><button onClick={() => navigate('/Comingsoon')}><FaExclamationCircle size={16} /> Complaints</button></li>
                            <li><button onClick={() => navigate('/Comingsoon')}><FaQuestionCircle size={16} /> Help & Support</button></li>
                            <li><button onClick={() => navigate('/settings')}><FaCog /> Settings</button></li>
                            
                            <button onClick={handleLogout}>
                                <FaSignOutAlt /> Logout
                            </button>
                        </ul>
                    </nav>
                </aside>
            )}
    
            <main className="admin-main-content">
                <h2>Admin Dashboard</h2>
    
                {!selectedProject && (
                    <div className="admin-stats-container">
                        <div className="admin-stats-box total">
                            <h4>Total Projects Submitted</h4>
                            <p>{totalProjects}</p>
                        </div>
                        <div className="admin-stats-box pending">
                            <h4>Waiting for Approval</h4>
                            <p>{pendingProjects}</p>
                        </div>
                        <div className="admin-stats-box approved">
                            <h4>Approved Projects</h4>
                            <p>{approvedProjects}</p>
                        </div>
                    </div>
                )}
    
    <section className="adminshow-project-submissions-section">
    <h3>Project Submissions</h3>
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
                <p><strong>Category:</strong> {selectedProject.category}</p>
                <p><strong>Keywords:</strong> {selectedProject.keywords || 'N/A'}</p>
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
                <button className="approve-btn" onClick={() => handleApprove(selectedProject.id)}>Approve</button>
                <button className="reject-btn" onClick={() => handleReject(selectedProject.id)}>Reject</button>
                <button className="back-btn" onClick={() => setSelectedProject(null)}>Back to List</button>
            </div>
        </div>
    ) 
                     : (
                        <table className="admin-project-table">
                            <thead>
                                <tr>
                                    <th>Project Name</th>
                                    <th>Description</th>
                                    <th>Budget</th>
                                    <th>Student ID</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.length === 0 ? (
                                    <tr><td colSpan="5">No pending projects.</td></tr>
                                ) : (
                                    projects.map(project => (
                                        <tr key={project.id}>
                                            <td>{project.title}</td>
                                            <td>{project.description}</td>
                                            <td>${project.proposed_budget}</td>
                                            <td>{project.student_id}</td>
                                            <td>
                                                <button className="admin-view-btn" onClick={() => handleViewProject(project)}>
                                                    <FaCheckCircle /> View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </section>
            </main>
    
            {!selectedProject && (
                <aside className="admin-notifications">
                    <h3>Notifications</h3>
                    <ul className="admin-notifications-list">
                        {notifications.length === 0 ? (
                            <li>No new notifications</li>
                        ) : (
                            notifications.map((notification, index) => (
                                <li key={index}>
                                    <strong>{notification.title}</strong>
                                    <p>{notification.message}</p>
                                </li>
                            ))
                        )}
                    </ul>
                </aside>
            )}
        </div>
    );
    
}

export default AdminDashboard;