import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCog, FaProjectDiagram, FaCheckCircle, FaEnvelope, 
         FaExclamationCircle, FaQuestionCircle, FaTachometerAlt, 
         FaDownload, FaCog, FaSearch, FaFilter, FaSortAmountDown, 
         FaSortAmountUp, FaChevronLeft, FaChevronRight, FaMoneyBill } from 'react-icons/fa';
         import "./BrowseProjects.css";

function BrowseProjects() {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [priceFilter, setPriceFilter] = useState('lowToHigh');
    const navigate = useNavigate();
    
    const handleBackToDashboard = () => {
        navigate('/investor'); 
    };

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/investor/approved-projects');
                if (!response.ok) {
                    if (response.status === 404) {
                        setErrorMessage('No approved projects found.');
                    } else {
                        throw new Error('Failed to fetch projects.');
                    }
                } else {
                    const data = await response.json();
                    setProjects(data.projects);
                    setFilteredProjects(data.projects);
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
                setErrorMessage('An error occurred while fetching projects.');
            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        // Apply filters when search query, category, or price filter changes
        let filtered = projects;

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(project =>
                project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by category
        if (categoryFilter) {
            filtered = filtered.filter(project =>
                project.category.toLowerCase() === categoryFilter.toLowerCase()
            );
        }

        // Filter by price
        if (priceFilter === 'lowToHigh') {
            filtered = filtered.sort((a, b) => a.proposed_budget - b.proposed_budget);
        } else if (priceFilter === 'highToLow') {
            filtered = filtered.sort((a, b) => b.proposed_budget - a.proposed_budget);
        }

        setFilteredProjects(filtered);
    }, [searchQuery, categoryFilter, priceFilter, projects]);

    const handleViewProject = (project) => {
        setSelectedProject(project);
    };

    const constructFileUrl = (filePath) => {
        if (!filePath) return null;
        return `http://localhost/nayyar/done/ideafunder/storage/app/public/${filePath}`;
    };

    const handleApprove = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/admin/projects/${id}/approve`, {
                method: 'PUT',
            });
            const data = await response.json();
            alert(data.message);
            setProjects(projects.filter(project => project.id !== id));
            setSelectedProject(null);
        } catch (error) {
            console.error('Error approving project:', error);
        }
    };

    const handleFundProject = (project) => {
        navigate('/payment', { state: project });
    };

    return (
        <div className="browse-projects-container">
            <div className="browse-header">
                <h2><FaProjectDiagram className="header-icon" /> Browse Projects</h2>
                {!selectedProject && (
                    <div className="search-container">
                        <div className="search-box">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search by title, category, or keywords..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </div>
            
            {/* Filters - Only show when no project is selected */}
            {!selectedProject && (
                <div className="filters-container">
                    <div className="filter-wrapper">
                        <div className="filter-header">
                            <FaFilter className="filter-icon" />
                            <span>Filters</span>
                        </div>
                        
                        <div className="filter-options">
                            {/* Category Filter */}
                            <div className="filter-group">
                                <label htmlFor="category">Project Category</label>
                                <select
                                    id="category"
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                >
                                    <option value="">All Categories</option>
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

                            {/* Price Filter */}
                            <div className="filter-group">
                                <label htmlFor="priceSort">Sort by Budget</label>
                                <div className="price-filter-wrapper">
                                    <select
                                        id="priceSort"
                                        value={priceFilter}
                                        onChange={(e) => setPriceFilter(e.target.value)}
                                    >
                                        <option value="lowToHigh">Low to High</option>
                                        <option value="highToLow">High to Low</option>
                                    </select>
                                    {priceFilter === "lowToHigh" ? (
                                        <FaSortAmountUp className="sort-icon" />
                                    ) : (
                                        <FaSortAmountDown className="sort-icon" />
                                    )}
                                </div>
                            </div>
                            
                            {/* Clear Filter Button */}
                            {categoryFilter && (
                                <button 
                                    onClick={() => setCategoryFilter('')} 
                                    className="clear-filter-btn"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Display Error or Project Details */}
            {errorMessage ? (
                <div className="error-container">
                    <FaExclamationCircle className="error-icon" />
                    <p className="error-message">{errorMessage}</p>
                </div>
            ) : selectedProject ? (
                <div className="project-detail-container">
                    <div className="project-detail-header">
                        <h3>{selectedProject.title}</h3>
                        <div className="project-category-tag">{selectedProject.category}</div>
                    </div>
                    
                    <div className="project-detail-grid">
                        <div className="project-info-section">
                            <h4>Project Overview</h4>
                            <div className="info-row">
                                <span className="info-label">Student ID:</span>
                                <span className="info-value">{selectedProject.student_id}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Supervisor:</span>
                                <span className="info-value">{selectedProject.supervisor || 'N/A'}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Deployment Time:</span>
                                <span className="info-value">{selectedProject.deployment_time || 'N/A'} days</span>
                            </div>
                            <div className="info-row budget-row">
                                <span className="info-label">Proposed Budget:</span>
                                <span className="info-value budget-value">
                                    <FaMoneyBill className="budget-icon" />
                                    ${selectedProject.proposed_budget || 'N/A'}
                                </span>
                            </div>
                        </div>
                        
                        <div className="project-description-section">
                            <h4>Project Description</h4>
                            <p>{selectedProject.description}</p>
                            
                            <h4>Problem Statement</h4>
                            <p>{selectedProject.problem_statement || 'Not provided'}</p>
                            
                            <h4>Solution Statement</h4>
                            <p>{selectedProject.solution_statement || 'Not provided'}</p>
                        </div>
                    </div>
                    
                    <div className="project-details-section">
                        <div className="details-columns">
                            <div className="details-column">
                                <h4>Technical Details</h4>
                                <div className="info-row">
                                    <span className="info-label">Technologies Used:</span>
                                    <span className="info-value">{selectedProject.technologies_used || 'N/A'}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Features:</span>
                                    <span className="info-value">{selectedProject.features || 'N/A'}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Keywords:</span>
                                    <div className="keywords-container">
                                        {selectedProject.keywords ? 
                                            selectedProject.keywords.split(',').map((keyword, idx) => (
                                                <span key={idx} className="keyword-tag">{keyword.trim()}</span>
                                            )) : 
                                            'N/A'
                                        }
                                    </div>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Required Resources:</span>
                                    <span className="info-value">{selectedProject.required_resources || 'N/A'}</span>
                                </div>
                            </div>
                            
                            <div className="details-column files-column">
                                <h4>Project Files</h4>
                                <div className="file-links">
                                    {selectedProject.srs_document && (
                                        <a href={constructFileUrl(selectedProject.srs_document)} 
                                           target="_blank" 
                                           rel="noopener noreferrer"
                                           className="file-link">
                                            <FaDownload className="file-icon" />
                                            <span>SRS Document</span>
                                        </a>
                                    )}
                                    
                                    {selectedProject.additional_files && (
                                        <a href={constructFileUrl(selectedProject.additional_files)} 
                                           target="_blank" 
                                           rel="noopener noreferrer"
                                           className="file-link">
                                            <FaDownload className="file-icon" />
                                            <span>Additional Files</span>
                                        </a>
                                    )}
                                    
                                    {selectedProject.presentation_proposal && (
                                        <a href={constructFileUrl(selectedProject.presentation_proposal)} 
                                           target="_blank" 
                                           rel="noopener noreferrer"
                                           className="file-link">
                                            <FaDownload className="file-icon" />
                                            <span>Presentation Proposal</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {selectedProject.ui_ux_preview && (
                            <div className="ui-ux-preview">
                                <h4>UI/UX Preview</h4>
                                <img 
                                    src={constructFileUrl(selectedProject.ui_ux_preview)} 
                                    alt="UI/UX Preview" 
                                />
                            </div>
                        )}
                    </div>
                    
                    <div className="project-actions">
                        <button 
                            className="back-btn" 
                            onClick={() => setSelectedProject(null)}
                        >
                            <FaChevronLeft className="btn-icon" />
                            Back to List
                        </button>
                        <button 
                            className="fund-btn" 
                            onClick={() => handleFundProject(selectedProject)}
                        >
                            Let's Fund
                            <FaChevronRight className="btn-icon" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="projects-grid">
                    {filteredProjects.length === 0 ? (
                        <div className="no-projects">
                            <FaExclamationCircle className="no-projects-icon" />
                            <p>No projects found matching your criteria.</p>
                        </div>
                    ) : (
                        filteredProjects.map(project => (
                            <div key={project.id} className="project-card">
                                <div className="project-card-category">{project.category}</div>
                                <h3>{project.title}</h3>
                                <div className="project-card-budget">
                                    <FaMoneyBill className="budget-icon" />
                                    <span>${project.proposed_budget}</span>
                                </div>
                                <button 
                                    onClick={() => handleViewProject(project)}
                                    className="view-details-btn"
                                >
                                    View Details
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}
            
            {/* Back to Dashboard Button - Always visible */}
            <div className="dashboard-action">
                <button onClick={handleBackToDashboard} className="dashboard-btn">
                    <FaTachometerAlt className="btn-icon" />
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}

export default BrowseProjects;