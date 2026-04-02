import React, { useEffect, useState } from 'react';
import './ProjectDetails.css';

function ProjectDetails() {
  const [approvedProjects, setApprovedProjects] = useState([]);
  const [rejectedProjects, setRejectedProjects] = useState([]);
  const [pendingProjects, setPendingProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const approved = await fetch('http://127.0.0.1:8000/api/approved-projects');
        const rejected = await fetch('http://127.0.0.1:8000/api/rejected-projects');
        const pending = await fetch('http://127.0.0.1:8000/api/pending-projects');

        setApprovedProjects(await approved.json());
        setRejectedProjects(await rejected.json());
        setPendingProjects(await pending.json());
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="project-details-container">
      <h1>Project Details</h1>
      
      <div className="project-table">
        <h2>Approved Projects</h2>
        <table>
          <thead>
            <tr>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {approvedProjects.map((project, index) => (
              <tr key={index}>
                <td>{project.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="project-table">
        <h2>Rejected Projects</h2>
        <table>
          <thead>
            <tr>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {rejectedProjects.map((project, index) => (
              <tr key={index}>
                <td>{project.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="project-table">
        <h2>Pending Projects</h2>
        <table>
          <thead>
            <tr>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {pendingProjects.map((project, index) => (
              <tr key={index}>
                <td>{project.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProjectDetails;
