import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MyProjects.css';
const MyProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all projects associated with the logged-in student
  useEffect(() => {
    const fetchProjects = async () => {
      const email = localStorage.getItem('email'); // Fetch email from localStorage
      if (!email) {
        setError('Email not available. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/student/projects?email=${email}`);
        setProjects(response.data.projects); // Assuming backend sends a 'projects' array
      } catch (err) {
        setError('Failed to fetch projects.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleEdit = (projectId) => {
    navigate(`/student/edit-project/${projectId}`); // Navigate to EditProject page with project ID
  };
  const handleBackToDashboard = () => {
    navigate('/student'); // Replace with your admin dashboard route
};

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="my-projects-container">
      <h2>My Projects</h2>
      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div className="project-list">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <h3>{project.title}</h3>
              <p><strong>Description:</strong> {project.description}</p>
              <p><strong>Status:</strong> {project.status}</p>
              <button onClick={() => handleEdit(project.id)}>Edit Project</button>
            </div>
          ))}
        </div>
      )}
      {/* Back to Dashboard Button */}
      <div className="back-button-container">
                <button onClick={handleBackToDashboard} className="back-button">
                    Back to Dashboard
                </button></div>
    </div>
  );
};

export default MyProjects;

