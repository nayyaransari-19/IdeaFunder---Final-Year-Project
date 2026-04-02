import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProfilePreview.css';

function ProfilePreview() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) {
      fetchProfile(email);
    } else {
      navigate('/signin');
    }
  }, [navigate]);

  const fetchProfile = async (email) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/student/profile/preview?email=${email}`);
      setProfile(response.data.profile);
      localStorage.setItem('profileData', JSON.stringify(response.data.profile));
    } catch (error) {
      console.error('Error fetching profile:', error);
      navigate('/student/profile'); // If no profile, go to the profile setup page
    } finally {
      setLoading(false);
    }
  };

  const constructFileUrl = (filePath) => {
    if (!filePath) return null;
    return `http://localhost/nayyar/done/ideafunder/storage/app/public/${filePath}`;
  };
  
  const handleBackToDashboard = () => {
    navigate('/student');
  };

  const handleEdit = () => {
    navigate('/student/profile', { state: { profile } });
  };

  if (loading) {
    return (
      <div className="profile-preview-container" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>Loading profile...</div>
          <div style={{ width: '50px', height: '50px', margin: '20px auto', border: '5px solid #f3f3f3', borderTop: '5px solid #28a745', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
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
    <div className="profile-preview-container">
      <h2 className="profile-header">Student Profile</h2>
      
      {profile ? (
        <div className="profile-content">
          <div className="profile-center">
            <div className="profile-image-container">
              <img src={constructFileUrl(profile.profile_picture)} alt="Profile" className="profile-image" />
            </div>
            <h3 className="profile-name">{profile.first_name} {profile.last_name}</h3>
          </div>

          <div className="profile-info-sections">
            <div className="profile-section">
              <h4>Introduction</h4>
              <p>{profile.introduction}</p>
            </div>

            <div className="profile-section">
              <h4>Skills</h4>
              <p>{profile.skills}</p>
            </div>

            <div className="profile-section">
              <h4>Past Experience</h4>
              <p>{profile.past_experience}</p>
            </div>

            <div className="profile-section">
              <h4>Dedication</h4>
              <p>{profile.dedication}</p>
            </div>

            <div className="profile-section">
              <h4>Future Goals</h4>
              <p>{profile.future_goals}</p>
            </div>
          </div>

          <div className="personal-info">
            <h3>Student Details</h3>
            <div className="personal-details">
              <div>
                <strong>Student ID:</strong> {profile.student_id}
              </div>
              {profile.department && (
                <div>
                  <strong>Department:</strong> {profile.department}
                </div>
              )}
              {profile.program && (
                <div>
                  <strong>Program:</strong> {profile.program}
                </div>
              )}
              {profile.graduation_year && (
                <div>
                  <strong>Graduation Year:</strong> {profile.graduation_year}
                </div>
              )}
              {profile.campus && (
                <div>
                  <strong>Campus:</strong> {profile.campus}
                </div>
              )}
            </div>
          </div>

          <button className="edit-profile-button" onClick={handleEdit}>
            Edit Profile
          </button>
          
          <div className="back-button-container">
            <button onClick={handleBackToDashboard} className="back-button">
              Back to Dashboard
            </button>
          </div>
        </div>
      ) : (
        <div className="profile-content" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '20px', color: '#666', marginBottom: '20px' }}>
            No profile information found.
          </div>
          <button 
            onClick={() => navigate('/student/profile')} 
            style={{
              padding: '12px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Create Profile
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfilePreview;