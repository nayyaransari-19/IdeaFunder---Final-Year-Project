import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Settings.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Settings() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        role: '',
        student_id: '',
        admin_id: '',
        investor_id: '',
        program: '',
        graduation_year: '',
        campus: '',
        password: '',
        confirm_password: '',
    });

    const [userData, setUserData] = useState({});
    const [message, setMessage] = useState('');
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const email = localStorage.getItem('email');
        if (email) {
            fetchSettings(email);
        } else {
            setError({ general: 'No email found. Please log in again.' });
            setLoading(false);
        }
    }, []);

    const fetchSettings = async (email) => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/user/settings', {
                params: { email },
            });

            if (response.data.user) {
                setUserData(response.data.user);
                setFormData((prevData) => ({
                    ...prevData,
                    ...response.data.user,
                    password: '',
                    confirm_password: '',
                }));
            }
        } catch (error) {
            setError({ general: 'Error fetching settings. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateSettings = async () => {
        let validationErrors = {};
    
        if (!formData.first_name.trim()) {
            validationErrors.first_name = '';
            toast.error('First name is required.');
        }
    
        if (!formData.last_name.trim()) {
            validationErrors.last_name = '';
            toast.error('Last name is required.');
        }
    
        if (formData.password && formData.password.length < 8) {
            validationErrors.password = '';
            toast.error('Password must be at least 8 characters.');
        } else if (!formData.password.trim()) {
            validationErrors.password = '';
            toast.error('Please fill the password.');
        }
    
        if (formData.password && formData.password !== formData.confirm_password) {
            validationErrors.confirm_password = '';
            toast.error('Passwords do not match.');
        }
    
        if (Object.keys(validationErrors).length > 0) {
            setError(validationErrors);
            return;
        }
    
        setError({});
        setLoading(true);
    
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/user/settings/update', {
                email: formData.email,
                first_name: formData.first_name,
                last_name: formData.last_name,
                password: formData.password,
                password_confirmation: formData.confirm_password,
            });
    
            setMessage(response.data.message);
            toast.success(response.data.message);
    
            // Update userData for name shown in UI
            setUserData((prev) => ({
                ...prev,
                first_name: formData.first_name,
                last_name: formData.last_name,
            }));
    
            // Clear password fields after successful update
            setFormData((prevData) => ({
                ...prevData,
                password: '',
                confirm_password: '',
            }));
        } catch (error) {
            setError({
                general: error.response?.data?.message || 'Error updating settings.',
            });
            toast.error(error.response?.data?.message || 'Error updating settings.');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        if (formData.role === 'Student/Faculty') {
            navigate('/student');
        } else if (formData.role === 'Admin') {
            navigate('/admin');
        } else if (formData.role === 'Investor') {
            navigate('/investor');
        } else {
            navigate('/');
        }
    };

    if (loading) {
        return <div className="loading-message">Loading settings...</div>;
    }

    return (
        <div className="settings-container">
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            <div className="settings-form-container">
                <div className="text-center">
                    <img src={logo} alt="Logo" className="settings-logo" />
                    <h2 className="settings-title">
                        {userData.first_name ? `${userData.first_name}'s Settings` : 'Account Settings'}
                    </h2>
                </div>

                {message && <div className="settings-message success-message">{message}</div>}
                {error.general && <div className="settings-message error-message">{error.general}</div>}

                <div className="form-row">
                    <div className="form-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            className={`settings-input ${error.first_name ? 'input-error' : ''}`}
                            placeholder="Enter first name"
                        />
                        {error.first_name && <p className="error-text">First name is required</p>}
                    </div>

                    <div className="form-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            className={`settings-input ${error.last_name ? 'input-error' : ''}`}
                            placeholder="Enter last name"
                        />
                        {error.last_name && <p className="error-text">Last name is required</p>}
                    </div>
                </div>

                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={userData.email || ''}
                    readOnly
                    className="settings-input"
                />

                <label>Role</label>
                <input
                    type="text"
                    name="role"
                    value={userData.role || ''}
                    readOnly
                    className="settings-input"
                />

                {userData.role === 'Student/Faculty' && (
                    <>
                        <label>Student ID</label>
                        <input
                            type="text"
                            name="student_id"
                            value={userData.student_id || ''}
                            readOnly
                            className="settings-input"
                        />

                        <div className="form-row">
                            <div className="form-group">
                                <label>Program</label>
                                <input
                                    type="text"
                                    name="program"
                                    value={formData.program}
                                    onChange={handleChange}
                                    className="settings-input"
                                    placeholder="Enter program"
                                />
                            </div>

                            <div className="form-group">
                                <label>Graduation Year</label>
                                <input
                                    type="text"
                                    name="graduation_year"
                                    value={userData.graduation_year || ''}
                                    readOnly
                                    className="settings-input"
                                />
                            </div>
                        </div>

                        <label>Campus</label>
                        <input
                            type="text"
                            name="campus"
                            value={formData.campus}
                            onChange={handleChange}
                            className="settings-input"
                            placeholder="Enter campus"
                        />
                    </>
                )}

                <div className="form-row">
                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`settings-input ${error.password ? 'input-error' : ''}`}
                            placeholder="Enter new password"
                        />
                        {error.password && <p className="error-text">Password must be at least 8 characters</p>}
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirm_password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            className={`settings-input ${error.confirm_password ? 'input-error' : ''}`}
                            placeholder="Confirm new password"
                        />
                        {error.confirm_password && (
                            <p className="error-text">Passwords do not match</p>
                        )}
                    </div>
                </div>

                <div className="button-container">
                    <button
                        onClick={handleUpdateSettings}
                        className="settings-button"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Settings'}
                    </button>

                    <button onClick={handleBack} className="back-button">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Settings;