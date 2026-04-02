import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaArrowLeft, FaDownload, FaChevronLeft, FaChevronRight, FaStar, FaQuoteLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './SwipeProjects.css';

function SwipeProjects() {
    const [projects, setProjects] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [dragDirection, setDragDirection] = useState(null);
    const [visibleCards, setVisibleCards] = useState([]);
    const cardRefs = useRef([]);
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
                    setProjects(data.projects || []);
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
                setErrorMessage('An error occurred while fetching projects.');
            }
        };

        fetchProjects();
    }, []);

    // Update visible cards whenever current index changes
    useEffect(() => {
        if (projects.length) {
            updateVisibleCards();
        }
    }, [currentIndex, projects]);

    const updateVisibleCards = () => {
        // Create array of indexes for visible cards (current, previous, next)
        const indices = [];
        
        // Previous card if exists
        if (currentIndex > 0) {
            indices.push(currentIndex - 1);
        }
        
        // Current card
        indices.push(currentIndex);
        
        // Next card if exists
        if (currentIndex < projects.length - 1) {
            indices.push(currentIndex + 1);
        }
        
        // Map indices to projects
        const visible = indices.map(index => ({
            project: projects[index],
            index: index,
            position: index < currentIndex ? "prev" : index > currentIndex ? "next" : "current"
        }));
        
        setVisibleCards(visible);
    };

    // Touch and drag handling for cards
    useEffect(() => {
        let touchStartX = 0;
        let touchStartY = 0;

        const handleTouchStart = (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        };

        const handleTouchEnd = (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaX = touchStartX - touchEndX;
            const deltaY = touchStartY - touchEndY;

            // Determine if the swipe was primarily horizontal or vertical
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal swipe
                if (deltaX > 70) {
                    handleSwipe('left'); // Swipe left (reject)
                } else if (deltaX < -70) {
                    handleSwipe('right'); // Swipe right (accept)
                }
            } else {
                // Vertical swipe (keep for compatibility)
                if (deltaY > 50) {
                    handleSwipe('up'); // Swipe up (next)
                } else if (deltaY < -50) {
                    handleSwipe('down'); // Swipe down (previous)
                }
            }
            
            // Reset drag direction
            setDragDirection(null);
        };

        const handleTouchMove = (e) => {
            if (!cardRefs.current[currentIndex]) return;
            
            const touchX = e.touches[0].clientX;
            const deltaX = touchX - touchStartX;
            
            if (deltaX > 20) {
                setDragDirection('right');
            } else if (deltaX < -20) {
                setDragDirection('left');
            } else {
                setDragDirection(null);
            }
        };

        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchend', handleTouchEnd);
        window.addEventListener('touchmove', handleTouchMove);

        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, [currentIndex, projects]);

    const handleSwipe = (dir) => {
        if ((dir === 'up' || dir === 'right') && currentIndex < projects.length - 1) {
            setDirection(dir);
            setCurrentIndex(currentIndex + 1);
        } else if ((dir === 'down' || dir === 'left') && currentIndex > 0) {
            setDirection(dir);
            setCurrentIndex(currentIndex - 1);
        } else if (dir === 'right' && currentIndex === projects.length - 1) {
            // Handle last card right swipe - could show a special message or reset
            alert("You've viewed all projects! Starting from the beginning.");
            setDirection(dir);
            setCurrentIndex(0);
        }
    };

    const handleFundProject = (project) => {
        // Your funding logic here
        alert(`You're funding project: ${project.title}`);
    };

    const handleViewProject = (project) => {
        setSelectedProject(project);
    };

    const constructFileUrl = (filePath) => {
        if (!filePath) return null;
        return `http://localhost/nayyar/done/ideafunder/storage/app/public/${filePath}`;
    };

    const renderFile = (label, filePath) => {
        const url = constructFileUrl(filePath);
        if (!url) return null;

        const fileExtension = filePath.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
            return (
                <div className="file-preview">
                    <strong>{label}:</strong>
                    <img src={url} alt="Preview" className="preview-image" />
                </div>
            );
        }

        return (
            <div className="file-link">
                <strong>{label}:</strong>{' '}
                <a href={url} target="_blank" rel="noopener noreferrer" className="download-link">
                    <FaDownload /> {fileExtension === 'pdf' ? 'View PDF Document' : 'Download File'}
                </a>
            </div>
        );
    };

    const inspirationalQuotes = [
        "Great ideas shape the future",
        "Innovation distinguishes leaders from followers",
        "Invest in dreams that transform reality",
        "True innovation solves real problems",
        "The best investment is in young minds"
    ];

    // Function to truncate text to a certain number of words
    const truncateText = (text, wordCount) => {
        if (!text) return '';
        const words = text.split(' ');
        if (words.length <= wordCount) return text;
        return words.slice(0, wordCount).join(' ') + '...';
    };

    return (
        <div className="swipe-container">
            <div className="glass-background">
                <div className="bg-patterns">
                    <div className="pattern pattern-1"></div>
                    <div className="pattern pattern-2"></div>
                    <div className="pattern pattern-3"></div>
                </div>
            </div>
            
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            
            {!selectedProject ? (
                <>
                    <h1 className="swipe-title">Discover Innovative Projects</h1>
                    <div className="swipe-instructions">
                        <p>Swipe right to fund, swipe left to pass, or click for details</p>
                    </div>
                    
                    <div className="quote-container">
                        <FaQuoteLeft className="quote-icon" />
                        <p className="inspirational-quote">{inspirationalQuotes[currentIndex % inspirationalQuotes.length]}</p>
                    </div>
                    
                    <div className="card-stack-container">
                        <AnimatePresence mode="wait">
                            {visibleCards.map((item, idx) => {
                                const { project, position, index } = item;
                                if (!project) return null;
                                
                                const isActive = position === "current";
                                
                                // Set z-index based on position for proper stacking
                                const zIndex = position === "current" ? 10 : position === "prev" ? 5 : 1;
                                
                                // Card positioning and scaling
                                let xPosition = 0;
                                let scale = 1;
                                let opacity = 1;
                                let rotate = 0;
                                
                                if (position === "prev") {
                                    xPosition = -40;
                                    scale = 0.85;
                                    opacity = 0.7;
                                    rotate = -5;
                                } else if (position === "next") {
                                    xPosition = 40;
                                    scale = 0.85;
                                    opacity = 0.7;
                                    rotate = 5;
                                }
                                
                                // If being dragged, adjust based on drag direction
                                if (isActive && dragDirection) {
                                    rotate = dragDirection === 'right' ? 5 : -5;
                                }
                                
                                return (
                                    <motion.div
                                        key={index}
                                        className={`card ${position}-card ${isActive ? 'active-card' : ''}`}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ 
                                            x: xPosition,
                                            scale: scale,
                                            opacity: opacity,
                                            rotateZ: rotate,
                                            zIndex: zIndex
                                        }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        drag={isActive}
                                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                        dragElastic={0.7}
                                        ref={el => {
                                            if (cardRefs.current.length <= index) {
                                                cardRefs.current[index] = el;
                                            }
                                        }}
                                        onDragEnd={(e, { offset, velocity }) => {
                                            const swipe = Math.abs(offset.x) > 100;
                                            if (swipe) {
                                                const direction = offset.x > 0 ? 'right' : 'left';
                                                handleSwipe(direction);
                                            }
                                            setDragDirection(null);
                                        }}
                                        onDrag={(e, { offset }) => {
                                            if (offset.x > 50) {
                                                setDragDirection('right');
                                            } else if (offset.x < -50) {
                                                setDragDirection('left');
                                            } else {
                                                setDragDirection(null);
                                            }
                                        }}
                                    >
                                        <div className={`card-content ${!isActive ? 'blurred' : ''}`}>
                                            {position === "current" && (
                                                <div className="swipe-indicators">
                                                    <div className={`swipe-indicator left ${dragDirection === 'left' ? 'active' : ''}`}>
                                                        Pass
                                                    </div>
                                                    <div className={`swipe-indicator right ${dragDirection === 'right' ? 'active' : ''}`}>
                                                        Fund
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <div className="card-header">
                                                <h2>{project.title}</h2>
                                                <span className="category-badge">{project.category}</span>
                                            </div>
                                            
                                            <div className="ui-ux-preview-container">
                                                <img
                                                    src={
                                                        project.ui_ux_preview
                                                            ? constructFileUrl(project.ui_ux_preview)
                                                            : "https://via.placeholder.com/200x150?text=UI%2FUX+Preview"
                                                    }
                                                    alt="UI/UX Preview"
                                                    className="card-image"
                                                />
                                                <div className="image-overlay">
                                                    <div className="overlay-content">
                                                        <span className="view-label">View Details</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="card-info">
                                                <div className="info-section">
                                                    <h3>Description</h3>
                                                    <p className="project-description">{truncateText(project.description, 30)}</p>
                                                </div>
                                                
                                                <div className="project-meta-info">
                                                    <div className="info-item">
                                                        <span className="info-label">Budget</span>
                                                        <span className="info-value">${project.proposed_budget}</span>
                                                    </div>
                                                    {project.deployment_time && (
                                                        <div className="info-item">
                                                            <span className="info-label">Timeline</span>
                                                            <span className="info-value">{project.deployment_time} days</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {isActive && (
                                                <div className="swipe-actions">
                                                    <button 
                                                        className="swipe-action reject"
                                                        onClick={() => handleSwipe('left')}
                                                    >
                                                        <span>Pass</span>
                                                    </button>
                                                    <button 
                                                        className="view-details-btn"
                                                        onClick={() => handleViewProject(project)}
                                                    >
                                                        Details
                                                    </button>
                                                    <button 
                                                        className="swipe-action accept"
                                                        onClick={() => handleSwipe('right')}
                                                    >
                                                        <span>Fund</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {isActive && (
                                            <div className="card-progress">
                                                <div className="progress-text">
                                                    {currentIndex + 1} of {projects.length}
                                                </div>
                                                <div className="progress-bar">
                                                    <div 
                                                        className="progress-filled" 
                                                        style={{width: `${((currentIndex + 1) / projects.length) * 100}%`}}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Card click handler for viewing details */}
                                        {isActive && (
                                            <div 
                                                className="card-overlay" 
                                                onClick={() => handleViewProject(project)}
                                            ></div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                    
                    <div className="navigation-arrows">
                        <button 
                            className={`nav-arrow prev ${currentIndex === 0 ? 'disabled' : ''}`}
                            onClick={() => currentIndex > 0 && handleSwipe('left')}
                            disabled={currentIndex === 0}
                        >
                            <FaChevronLeft />
                        </button>
                        <button 
                            className={`nav-arrow next ${currentIndex === projects.length - 1 ? 'disabled' : ''}`}
                            onClick={() => currentIndex < projects.length - 1 && handleSwipe('right')}
                            disabled={currentIndex === projects.length - 1}
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                </>
            ) : (
                <div className="project-detail">
                    <div className="project-detail-header">
                        <button className="back-btn" onClick={() => setSelectedProject(null)}>
                            <FaArrowLeft /> Back to Projects
                        </button>
                        <div className="project-rating">
                            <FaStar className="star-icon" />
                            <FaStar className="star-icon" />
                            <FaStar className="star-icon" />
                            <FaStar className="star-icon" />
                            <FaStar className="star-icon half" />
                            <span className="rating-text">High Potential</span>
                        </div>
                    </div>
                    
                    <div className="project-hero">
                        <div className="project-title-container">
                            <h2>{selectedProject.title}</h2>
                            <span className="category-badge large">{selectedProject.category}</span>
                        </div>
                        
                        <div className="project-hero-image">
                            <img 
                                src={constructFileUrl(selectedProject.ui_ux_preview) || "https://via.placeholder.com/400x300?text=No+Preview"} 
                                alt="Project Preview" 
                            />
                        </div>
                    </div>
                    
                    <div className="project-detail-content">
                        <div className="project-info-section">
                            <div className="project-meta">
                                <div className="meta-card">
                                    <span className="meta-icon budget-icon">$</span>
                                    <div className="meta-info">
                                        <span className="meta-label">Investment Needed</span>
                                        <span className="meta-value">${selectedProject.proposed_budget}</span>
                                    </div>
                                </div>
                                
                                <div className="meta-card">
                                    <span className="meta-icon time-icon">⏱</span>
                                    <div className="meta-info">
                                        <span className="meta-label">Timeline</span>
                                        <span className="meta-value">{selectedProject.deployment_time || 'N/A'} days</span>
                                    </div>
                                </div>
                                
                                <div className="meta-card">
                                    <span className="meta-icon team-icon">👥</span>
                                    <div className="meta-info">
                                        <span className="meta-label">Student ID</span>
                                        <span className="meta-value">{selectedProject.student_id}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="project-description-section">
                                <h3>Project Overview</h3>
                                <p>{selectedProject.description}</p>
                            </div>
                            
                            <div className="project-tabs">
                                <div className="tabs-container">
                                    <div className="tab-content active">
                                        <div className="two-column-grid">
                                            <div className="detail-card">
                                                <h4>Problem Statement</h4>
                                                <p>{selectedProject.problem_statement || 'No problem statement provided.'}</p>
                                            </div>
                                            
                                            <div className="detail-card">
                                                <h4>Solution</h4>
                                                <p>{selectedProject.solution_statement || 'No solution statement provided.'}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="detail-card features-card">
                                            <h4>Key Features</h4>
                                            <div className="features-list">
                                                {selectedProject.features ? 
                                                    selectedProject.features.split(',').map((feature, index) => (
                                                        <div key={index} className="feature-item">
                                                            <span className="feature-bullet">•</span>
                                                            <span className="feature-text">{feature.trim()}</span>
                                                        </div>
                                                    )) : 
                                                    <p>No features listed</p>
                                                }
                                            </div>
                                        </div>
                                        
                                        <div className="two-column-grid">
                                            <div className="detail-card">
                                                <h4>Technologies</h4>
                                                <div className="technologies-list">
                                                    {selectedProject.technologies_used ? 
                                                        selectedProject.technologies_used.split(',').map((tech, index) => (
                                                            <span key={index} className="technology-badge">{tech.trim()}</span>
                                                        )) : 
                                                        <p>No technologies listed</p>
                                                    }
                                                </div>
                                            </div>
                                            
                                            <div className="detail-card">
                                                <h4>Resources Required</h4>
                                                <p>{selectedProject.required_resources || 'No resources specified'}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="detail-card">
                                            <h4>Project Documents</h4>
                                            <div className="project-files-grid">
                                                {selectedProject.srs_document && (
                                                    <div className="document-item">
                                                        <div className="document-icon">📄</div>
                                                        <div className="document-info">
                                                            <span className="document-title">SRS Document</span>
                                                            <a href={constructFileUrl(selectedProject.srs_document)} 
                                                               target="_blank" 
                                                               rel="noopener noreferrer" 
                                                               className="document-link">
                                                                <FaDownload /> Download
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {selectedProject.presentation_proposal && (
                                                    <div className="document-item">
                                                        <div className="document-icon">📊</div>
                                                        <div className="document-info">
                                                            <span className="document-title">Presentation</span>
                                                            <a href={constructFileUrl(selectedProject.presentation_proposal)} 
                                                               target="_blank" 
                                                               rel="noopener noreferrer" 
                                                               className="document-link">
                                                                <FaDownload /> Download
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {selectedProject.additional_files && (
                                                    <div className="document-item">
                                                        <div className="document-icon">📁</div>
                                                        <div className="document-info">
                                                            <span className="document-title">Additional Files</span>
                                                            <a href={constructFileUrl(selectedProject.additional_files)} 
                                                               target="_blank" 
                                                               rel="noopener noreferrer" 
                                                               className="document-link">
                                                                <FaDownload /> Download
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {!selectedProject.srs_document && 
                                                 !selectedProject.presentation_proposal && 
                                                 !selectedProject.additional_files && (
                                                    <p className="no-documents-message">No documents available for this project</p>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="project-keywords">
                                            <h4>Keywords</h4>
                                            <div className="keywords-container">
                                                {selectedProject.keywords ? 
                                                    selectedProject.keywords.split(',').map((keyword, index) => (
                                                        <span key={index} className="keyword-tag">{keyword.trim()}</span>
                                                    )) : 
                                                    <p>No keywords specified</p>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="investment-section">
                                <div className="investment-info">
                                    <div className="investment-header">
                                        <h3>Investment Opportunity</h3>
                                        <div className="potential-indicator">
                                            <span className="potential-dot high"></span>
                                            <span className="potential-text">High Potential</span>
                                        </div>
                                    </div>
                                    <p className="investment-pitch">
                                        Invest in this project to support innovation and potentially gain returns through its successful implementation.
                                    </p>
                                </div>
                                
                                <div className="project-actions">
                                    <button 
                                        className="fund-btn" 
                                        onClick={() => handleFundProject(selectedProject)}
                                    >
                                        <FaHeart /> Fund This Project
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="back-button-container">
                <button onClick={handleBackToDashboard} className="dashboard-btn">
                    <FaArrowLeft /> Back to Dashboard
                </button>
            </div>
        </div>
    );
}

export default SwipeProjects;