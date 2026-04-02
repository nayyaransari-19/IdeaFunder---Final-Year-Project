import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';
import { FaHome, FaProjectDiagram, FaUser, FaCog, FaSignOutAlt, FaFileAlt, FaQuestionCircle, FaBell, FaRegClock } from 'react-icons/fa';
import axios from 'axios';
import idealogo from '../assets/logowhite.png';

function StudentDashboard() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [studentName, setStudentName] = useState('Student');

    useEffect(() => {
        const fetchDashboardData = async () => {
            const email = localStorage.getItem('email');
            if (!email) {
                setError('Email not available. Please log in again.');
                setIsLoading(false);
                return;
            }
    
            try {
                const nameResponse = await axios.get(`http://127.0.0.1:8000/api/student/name?email=${email}`);
                const { first_name, last_name } = nameResponse.data;
                setStudentName(`${first_name} ${last_name}`);
    
                const response = await axios.get(`http://127.0.0.1:8000/api/student/projects?email=${email}`);
                setProjects(response.data.projects);

                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/signin'); // Redirect to login page if no token is found
                } 
    
                const notificationsResponse = await axios.get(`http://127.0.0.1:8000/api/student/notifications?email=${email}`);
                setNotifications(notificationsResponse.data.notifications);
            } catch (err) {
                setError('Failed to fetch data.');
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchDashboardData();
    }, [navigate]);
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        navigate('/signin');
    };

    const handleEdit = (projectId) => {
        navigate(`/student/edit-project/${projectId}`);
    };

    // Format date for notifications
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit'
        });
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar Navigation */}
            <div className="dashboard-sidebar">
                <div className="sidebar-header">
                    <img src={idealogo} alt="Idea Funder Logo" className="sidebar-logo" />
                    <h3>IdeaFunder</h3>
                </div>
                
                <div className="sidebar-menu">
                    <div className="menu-item active" onClick={() => navigate('/student')}>
                        <FaHome />
                        <span>Dashboard</span>
                    </div>
                    <div className="menu-item" onClick={() => navigate('/student/my-projects')}>
                        <FaProjectDiagram />
                        <span>My Projects</span>
                    </div>
                    <div className="menu-item" onClick={() => navigate('/student/submit-project')}>
                        <FaFileAlt />
                        <span>Submit Project</span>
                    </div>
                    <div className="menu-item" onClick={() => navigate('/student/profile')}>
                        <FaUser />
                        <span>Profile</span>
                    </div>
                    <div className="menu-item" onClick={() => navigate('/settings')}>
                        <FaCog />
                        <span>Settings</span>
                    </div>
                    <div className="menu-item" onClick={() => navigate('/support')}>
                        <FaQuestionCircle />
                        <span>Support</span>
                    </div>
                </div>
                
                <div className="sidebar-footer">
                    <div className="menu-item logout" onClick={handleLogout}>
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </div>
                </div>
            </div>
            
            {/* Main Content Area */}
            <div className="dashboard-main">
                {/* Top Header */}
                <div className="dashboard-header">
                    <div className="header-welcome">
                        <h2>Welcome, {studentName}</h2>
                        <p>Empowering academic ideas to life!</p>
                    </div>
                    <div className="header-actions">
                        <button className="new-project-btn" onClick={() => navigate('/student/submit-project')}>
                            + New Project
                        </button>
                    </div>
                </div>
                
                {/* Dashboard Overview */}
                <div className="dashboard-overview">
                    <div className="overview-card">
                        <div className="card-icon projects-icon">
                            <FaProjectDiagram />
                        </div>
                        <div className="card-info">
                            <h3>{projects.length}</h3>
                            <p>Total Projects</p>
                        </div>
                    </div>
                    
                    <div className="overview-card">
                        <div className="card-icon notifications-icon">
                            <FaBell />
                        </div>
                        <div className="card-info">
                            <h3>{notifications.length}</h3>
                            <p>Notifications</p>
                        </div>
                    </div>
                    
                    <div className="overview-card">
                        <div className="card-icon pending-icon">
                            <FaRegClock />
                        </div>
                        <div className="card-info">
                            <h3>{projects.filter(p => p.status === "Pending").length}</h3>
                            <p>Pending Projects</p>
                        </div>
                    </div>
                </div>
                
                {/* Content Sections */}
                <div className="dashboard-content">
                    {/* Projects Section */}
                    <section className="content-section projects-section">
                        <div className="section-header">
                            <h3>My Projects</h3>
                            <button className="view-all-btn" onClick={() => navigate('/student/my-projects')}>
                                View All
                            </button>
                        </div>
                        
                        <div className="section-content">
                            {isLoading ? (
                                <div className="loading-container">
                                    <div className="loading-spinner"></div>
                                    <p>Loading projects...</p>
                                </div>
                            ) : error ? (
                                <div className="error-message">{error}</div>
                            ) : projects.length === 0 ? (
                                <div className="empty-state">
                                    <FaProjectDiagram className="empty-icon" />
                                    <p>No projects found. Submit your first project!</p>
                                    <button onClick={() => navigate('/student/submit-project')}>
                                        Create Project
                                    </button>
                                </div>
                            ) : (
                                <div className="project-cards">
                                    {projects.slice(0, 3).map((project) => (
                                        <div key={project.id} className="project-card">
                                            <div className="project-card-header">
                                                <h4>{project.title}</h4>
                                                <span className={`status-badge ${project.status.toLowerCase()}`}>
                                                    {project.status}
                                                </span>
                                            </div>
                                            <p className="project-description">{project.description}</p>
                                            <div className="project-card-footer">
                                                <button className="edit-btn" onClick={() => handleEdit(project.id)}>
                                                    Edit Project
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                    
                    {/* Notifications Section */}
                    <section className="content-section notifications-section">
                        <div className="section-header">
                            <h3>Notifications</h3>
                            <button className="mark-read-btn">
                                Mark All Read
                            </button>
                        </div>
                        
                        <div className="section-content">
                            {isLoading ? (
                                <div className="loading-container">
                                    <div className="loading-spinner"></div>
                                    <p>Loading notifications...</p>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="empty-state">
                                    <FaBell className="empty-icon" />
                                    <p>No new notifications</p>
                                </div>
                            ) : (
                                <div className="notification-list">
                                    {notifications.map(notification => (
                                        <div key={notification.id} className="notification-item">
                                            <div className="notification-content">
                                                <h4>{notification.title}</h4>
                                                <p>{notification.message}</p>
                                            </div>
                                            <div className="notification-time">
                                                {formatDate(notification.created_at)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard;