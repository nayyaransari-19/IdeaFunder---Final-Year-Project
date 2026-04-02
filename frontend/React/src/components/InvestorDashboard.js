import React from 'react';
import { useNavigate } from 'react-router-dom';
import './InvestorDashboard.css';
import { 
  FaHome, 
  FaProjectDiagram, 
  FaUser, 
  FaCog, 
  FaSignOutAlt, 
  FaFileAlt, 
  FaQuestionCircle,
  FaBell,
  FaChartLine,
  FaComments
} from 'react-icons/fa';
import axios from 'axios';

function InvestorDashboard() {
    const navigate = useNavigate();
    const [message, setMessage] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');

    React.useEffect(() => {
        const fetchName = async () => {
            try {
                const email = localStorage.getItem('email');
                const response = await axios.get(`http://127.0.0.1:8000/api/student/name?email=${email}`);
                setFirstName(response.data.first_name);
                setLastName(response.data.last_name);
            } catch (error) {
                console.error('Error fetching name:', error);
            }
        };

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/signin'); // Redirect to login page if no token is found
        }

        fetchName();
    }, [navigate]);

    const handleComingSoon = () => {
        setMessage('Feature Coming Soon!');
        setTimeout(() => setMessage(''), 3000);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        navigate('/signin');
    };

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h3 className="sidebar-logo">
                        <span className="logo-icon">
                            <FaChartLine />
                        </span>
                        <span className="logo-text">Investor Panel</span>
                    </h3>
                </div>
                
                <div className="user-info">
                    <div className="user-avatar">{firstName && lastName ? `${firstName.charAt(0)}${lastName.charAt(0)}` : "IP"}</div>
                    <div className="user-name">{firstName} {lastName}</div>
                </div>
                
                <nav className="sidebar-nav">
                    <ul>
                        <li>
                            <button onClick={() => navigate('/investor/browse-all-projects')} className="active-nav">
                                <FaFileAlt /> <span>Browse Projects</span>
                            </button>
                        </li>
                        
                        <li>
                            <button onClick={handleComingSoon}>
                                <FaProjectDiagram /> <span>Funded Projects</span>
                            </button>
                        </li>
                        
                        <li>
                            <button onClick={handleComingSoon}>
                                <FaComments /> <span>Messages</span>
                            </button>
                        </li>
                        
                        <li>
                            <button onClick={handleComingSoon}>
                                <FaBell /> <span>Notifications</span>
                            </button>
                        </li>
                        
                        <li>
                            <button onClick={() => navigate('/settings')}>
                                <FaCog /> <span>Settings</span>
                            </button>
                        </li>
                        
                        <li className="logout-item">
                            <button onClick={handleLogout} className="logout-btn">
                                <FaSignOutAlt /> <span>Logout</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>

            <main className="main-content">
                <header className="dashboard-header">
                    <div className="header-content">
                        <div className="welcome-section">
                            <h2>Welcome, {firstName} {lastName}</h2>
                            <p className="date">{currentDate}</p>
                            <p className="tagline">"Fuel ideas today, shape the future tomorrow."</p>
                        </div>
                    </div>
                </header>

                {message && (
                    <div className="notification-message">
                        <p>{message}</p>
                    </div>
                )}

                <div className="dashboard-grid">
                    <section className="dashboard-card browse-project-section">
                        <div className="card-header">
                            <h3><FaFileAlt /> Browse Projects</h3>
                        </div>
                        <div className="card-body">
                            <p className="card-description">Discover innovative projects seeking investment and filter by industry, funding goal, or expected ROI.</p>
                            <div className="action-buttons browse-buttons">
                                <button onClick={() => navigate('/investor/swipeup')} className="primary-btn">
                                    <span className="btn-icon">👆</span>
                                    <span className="btn-text">Swipe Up Browsing</span>
                                </button>
                                <button onClick={() => navigate('/investor/browse-all-projects')} className="secondary-btn">
                                    <span className="btn-icon">🔍</span>
                                    <span className="btn-text">Advanced Search</span>
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="dashboard-card funded-projects-section">
                        <div className="card-header">
                            <h3><FaProjectDiagram /> Funded Projects</h3>
                        </div>
                        <div className="card-body">
                            <p className="card-description">Track and manage all your investments, view performance metrics, and connect with founders.</p>
                            <div className="action-buttons funded-buttons">
                                <button onClick={handleComingSoon} className="primary-btn">
                                    <span className="btn-icon">👥</span>
                                    <span className="btn-text">Group Funded</span>
                                </button>
                                <button onClick={handleComingSoon} className="secondary-btn">
                                    <span className="btn-icon">👤</span>
                                    <span className="btn-text">Individual Funded</span>
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

                <section className="quick-stats-section">
                    <div className="stat-card">
                        <h4>Available for Investment</h4>
                        <p className="stat-value">$250,000</p>
                    </div>
                    <div className="stat-card">
                        <h4>Projects Viewed</h4>
                        <p className="stat-value">28</p>
                    </div>
                    <div className="stat-card">
                        <h4>Investment Opportunities</h4>
                        <p className="stat-value">143</p>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default InvestorDashboard;