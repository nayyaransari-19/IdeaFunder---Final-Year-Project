import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    student_id: '',
    first_name: '',
    last_name: '',
    skills: '',
    introduction: '',
    past_experience: '',
    dedication: '',
    future_goals: '',
    profile_picture: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem('email');

    if (!email) {
      toast.error('No email found. Please log in again.', { position: "top-center", autoClose: 5000 });
      setIsLoading(false);
      return;
    }

    if (location.state?.profile) {
      setFormData(location.state.profile);
      
      // If editing an existing profile with a profile picture
      if (location.state.profile.profile_picture) {
        // Handle the profile picture preview for editing
        const picturePath = location.state.profile.profile_picture;
        if (typeof picturePath === 'string') {
          setPreviewImage(`http://localhost/nayyar/done/ideafunder/storage/app/public/${picturePath}`);
        }
      }
      
      setIsLoading(false);
    } else {
      checkProfileExists(email);
    }
  }, [location]);

  const checkProfileExists = async (email) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/student/profile/preview?email=${email}`);
      if (response.status === 200 && response.data.profile) {
        navigate('/student/profile-preview');
      } else {
        fetchStudentData(email);
      }
    } catch (error) {
      fetchStudentData(email);
    }
  };

  const fetchStudentData = async (email) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/student/profile/get-id?email=${email}`);
      
      if (response.data.student_id) {
        setFormData((prevData) => ({
          ...prevData,
          student_id: response.data.student_id,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
        }));
      } else {
        toast.error('Student information not found.', { position: "top-center", autoClose: 5000 });
      }
    } catch (error) {
      toast.error('Error fetching student information.', { position: "top-center", autoClose: 5000 });
      console.error('Error fetching student info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      // Create a preview URL for the selected image
      if (files[0]) {
        setPreviewImage(URL.createObjectURL(files[0]));
        setFormData({ ...formData, [name]: files[0] });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    let errors = [];

    if (!formData.skills) errors.push("Skills field is required.");
    if (!formData.introduction) errors.push("Introduction field is required.");
    if (!formData.past_experience) errors.push("Past experience is required.");
    if (!formData.dedication) errors.push("Dedication field is required.");
    if (!formData.future_goals) errors.push("Future goals field is required.");
    
    // Only require profile picture if not editing an existing profile with image
    if (!previewImage && !formData.profile_picture) {
      errors.push("Profile picture is required (JPG, PNG).");
    }

    if (errors.length > 0) {
      toast.error(errors.join("\n"), { position: "top-center", autoClose: 5000 });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields before submitting
    if (!validateForm()) return;

    setIsLoading(true);

    const formPayload = new FormData();
    formPayload.append('email', localStorage.getItem('email'));

    Object.entries(formData).forEach(([key, value]) => {
      formPayload.append(key, value);
    });

    try {
      await axios.post('http://127.0.0.1:8000/api/student/profile/save', formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Profile saved successfully!', { position: "top-center", autoClose: 3000 });

      setTimeout(() => {
        navigate('/student/profile-preview', { state: { profile: formData } });
      }, 1000);
    } catch (error) {
      toast.error('Error submitting profile.', { position: "top-center", autoClose: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/student');
  };

  // Custom loading spinner
  if (isLoading) {
    return (
      <div className="profile-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745', marginBottom: '20px' }}>Loading...</div>
          <div style={{ width: '50px', height: '50px', margin: '0 auto', border: '5px solid #f3f3f3', borderTop: '5px solid #28a745', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <ToastContainer />

      <form onSubmit={handleSubmit} className="profile-form">
        <h2>
          {formData.first_name && formData.last_name
            ? `${formData.first_name} ${formData.last_name}'s Profile`
            : 'Student Profile'}
        </h2>

        <div className="form-group">
          <label>Student ID:</label>
          <input type="text" name="student_id" value={formData.student_id} readOnly />
        </div>

        <div className="form-group">
          <label>Skills:</label>
          <input 
            type="text" 
            name="skills" 
            placeholder="Enter your key skills (e.g., Programming, Leadership, Research)" 
            value={formData.skills} 
            onChange={handleChange} 
          />
        </div>

        <div className="form-group">
          <label>Introduction:</label>
          <textarea 
            name="introduction" 
            placeholder="Write a brief introduction about yourself" 
            value={formData.introduction} 
            onChange={handleChange} 
          />
        </div>

        <div className="form-group">
          <label>Past Experience:</label>
          <textarea 
            name="past_experience" 
            placeholder="Describe your relevant past experiences and achievements" 
            value={formData.past_experience} 
            onChange={handleChange} 
          />
        </div>

        <div className="form-group">
          <label>Dedication:</label>
          <textarea 
            name="dedication" 
            placeholder="Share your dedication to your field of study" 
            value={formData.dedication} 
            onChange={handleChange} 
          />
        </div>

        <div className="form-group">
          <label>Future Goals:</label>
          <textarea 
            name="future_goals" 
            placeholder="Describe your academic and career goals" 
            value={formData.future_goals} 
            onChange={handleChange} 
          />
        </div>

        <div className="form-group">
          <label>Profile Picture (JPG, PNG):</label>
          <input 
            type="file" 
            name="profile_picture" 
            accept=".jpg,.jpeg,.png" 
            onChange={handleChange} 
          />
          {previewImage && (
            <div style={{ 
              marginTop: '10px', 
              textAlign: 'center' 
            }}>
              <img 
                src={previewImage} 
                alt="Profile Preview" 
                style={{ 
                  width: '120px', 
                  height: '120px', 
                  objectFit: 'cover', 
                  borderRadius: '50%',
                  border: '3px solid #28a745' 
                }} 
              />
            </div>
          )}
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Profile'}
        </button>
        <button type="button" onClick={handleBackToDashboard} className="back-button">
          Back to Dashboard
        </button>
      </form>
    </div>
  );
}

export default Profile;