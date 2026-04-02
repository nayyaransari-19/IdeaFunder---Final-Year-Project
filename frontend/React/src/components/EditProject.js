import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaDownload, FaTrash } from "react-icons/fa";
import "./EditProject.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/projects/${id}`);
      setFormData(response.data.project);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching project:", error);
      setLoading(false);
    }
  };

  // Handles text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handles file input changes
  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  // Delete a file from the backend and update state
  const handleDeleteFile = async (fileField) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/projects/delete-file/${id}/${fileField}`);
  
      // Show success toast notification
      toast.success(`${fileField.replace("_", " ")} deleted successfully!`, {
        position: "top-center",
        autoClose: 3000,
      });
  
      // Remove file from state immediately
      setFormData((prev) => ({
        ...prev,
        [`${fileField}_url`]: null, // Remove file URL from the state
      }));
  
      fetchProject(); // Refresh project details
    } catch (error) {
      console.error("Error deleting file:", error);
  
      // Show error toast notification
      toast.error("Error deleting file.", {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };
  

  // Submit the updated form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObject = new FormData();
  
    for (const key in formData) {
      if (formData[key]) {
        formDataObject.append(key, formData[key]);
      }
    }
  
    try {
      await axios.post(`http://127.0.0.1:8000/api/projects/update/${id}`, formDataObject, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      // Show success toast notification
      toast.success("Project updated successfully!", {
        position: "top-center",
        autoClose: 3000,
      });
  
      fetchProject(); // Refresh project details
    } catch (error) {
      console.error("Error updating project:", error);
  
      // Show error toast notification
      toast.error("Error updating project.", {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };
  

  if (loading) return <p>Loading project...</p>;

  return (
    <div className="edit-project">
      <ToastContainer />
      <h1>Edit Project</h1>
      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit}>
        <input type="text" name="title" value={formData.title || ""} onChange={handleChange} required />
        <textarea name="description" value={formData.description || ""} onChange={handleChange} required />

        <input type="text" name="category" value={formData.category || ""} onChange={handleChange} />
        <input type="text" name="features" value={formData.features || ""} onChange={handleChange} />
        <input type="text" name="problem_statement" value={formData.problem_statement || ""} onChange={handleChange} />
        <input type="text" name="solution_statement" value={formData.solution_statement || ""} onChange={handleChange} />
        <input type="text" name="keywords" value={formData.keywords || ""} onChange={handleChange} />
        <input type="number" name="deployment_time" value={formData.deployment_time || ""} onChange={handleChange} />
        <input type="text" name="supervisor" value={formData.supervisor || ""} onChange={handleChange} />
        <input type="text" name="technologies_used" value={formData.technologies_used || ""} onChange={handleChange} />
        <input type="text" name="required_resources" value={formData.required_resources || ""} onChange={handleChange} />
        <input type="number" name="proposed_budget" value={formData.proposed_budget || ""} onChange={handleChange} />

        <label>Update Files</label>

        {/* SRS Document */}
<div className="file-preview-container">
    <label>Upload SRS Document:</label>
    <input type="file" name="srs_document" accept=".pdf" onChange={handleFileChange} />
    {formData.srs_document_url && (
        <div className="file-preview">
            <a href={formData.srs_document_url} target="_blank" rel="noopener noreferrer">
                <FaDownload className="file-icon" /> View SRS Document
            </a>
            <button type="button" className="delete-button" onClick={() => handleDeleteFile("srs_document")}>
                <FaTrash className="file-icon" /> Delete
            </button>
        </div>
    )}
</div>

{/* UI/UX Preview */}
<div className="file-preview-container">
    <label>Upload UI/UX Preview:</label>
    <input type="file" name="ui_ux_preview" accept=".jpg,.jpeg,.png" onChange={handleFileChange} />
    {formData.ui_ux_preview_url && (
        <div className="file-preview">
            <img src={formData.ui_ux_preview_url} alt="UI Preview" className="preview-image" />
            <button type="button" className="delete-button" onClick={() => handleDeleteFile("ui_ux_preview")}>
                <FaTrash className="file-icon" /> Delete
            </button>
        </div>
    )}
</div>

{/* Additional Files */}
<div className="file-preview-container">
    <label>Upload Additional Files:</label>
    <input type="file" name="additional_files" accept=".zip,.rar" onChange={handleFileChange} />
    {formData.additional_files_url && (
        <div className="file-preview">
            <a href={formData.additional_files_url} target="_blank" rel="noopener noreferrer">
                <FaDownload className="file-icon" /> Download Additional Files
            </a>
            <button type="button" className="delete-button" onClick={() => handleDeleteFile("additional_files")}>
                <FaTrash className="file-icon" /> Delete
            </button>
        </div>
    )}
</div>

{/* Presentation Proposal */}
<div className="file-preview-container">
    <label>Upload Presentation Proposal:</label>
    <input type="file" name="presentation_proposal" accept="." onChange={handleFileChange} />
    {formData.presentation_proposal_url && (
        <div className="file-preview">
            <a href={formData.presentation_proposal_url} target="_blank" rel="noopener noreferrer">
                <FaDownload className="file-icon" /> View Presentation Proposal
            </a>
            <button type="button" className="delete-button" onClick={() => handleDeleteFile("presentation_proposal")}>
                <FaTrash className="file-icon" /> Delete
            </button>
        </div>
    )}
</div>


        <button type="submit">Update Project</button>
      </form>
    </div>
  );
};

export default EditProject;
