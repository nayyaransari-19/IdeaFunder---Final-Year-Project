import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewProject = () => {
  const { id } = useParams(); // Extract 'id' from URL
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/projects/${id}`);
        setProject(response.data.project);
      } catch (err) {
        setError("Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) return <p>Loading project details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="view-project-container">
      <h2>{project.title}</h2>
      <p><strong>Description:</strong> {project.description}</p>
      <p><strong>Category:</strong> {project.category}</p>

      {project.srs_document_url && (
        <div>
          <h3>SRS Document</h3>
          <a href={project.srs_document_url} target="_blank" rel="noopener noreferrer">
            View SRS Document
          </a>
        </div>
      )}

      {project.ui_ux_preview_url && (
        <div>
          <h3>UI/UX Preview</h3>
          <img src={project.ui_ux_preview_url} alt="UI/UX Preview" style={{ maxWidth: "100%" }} />
        </div>
      )}
    </div>
  );
};

export default ViewProject;
