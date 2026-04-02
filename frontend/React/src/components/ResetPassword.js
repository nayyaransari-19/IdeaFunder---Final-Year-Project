import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Import the logo
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { email, token } = location.state || {};

    const handleResetPassword = async () => {
        if (!password || !confirmPassword) {
            toast.error("Please fill out both password fields.");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match. Please try again.");
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/reset-password', {
                email,
                token,
                password,
                password_confirmation: confirmPassword,
            });

            toast.success(response.data.message || "Password reset successfully!");
            
            setTimeout(() => {
                navigate('/signin');
            }, 3000); // Redirect after 3 seconds
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reset password.");
        }
    };

    return (
        <div style={styles.container}>
            {/* Toastify Container */}
            <ToastContainer 
                position="top-center"
                autoClose={3000} 
                hideProgressBar={false} 
                closeOnClick
                pauseOnHover
                draggable
            />

            <div style={styles.formContainer}>
                {/* Logo */}
                <div style={styles.logoContainer}>
                    <img 
                        src={logo} 
                        alt="Logo" 
                        style={styles.logo} 
                    />
                </div>

                <h2 style={styles.title}>Reset Password</h2>

                <input
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={styles.input}
                />
                <button onClick={handleResetPassword} style={styles.button}>Reset Password</button>
            </div>
        </div>
    );
}

// Styling
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f7f7f7', // Light background for contrast
        padding: '2rem',
    },
    formContainer: {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
    },
    logoContainer: {
        textAlign: 'center',
        marginBottom: '20px', // Space between logo and form
    },
    logo: {
        width: '100px', // Set the size of the logo
        height: 'auto', // Maintain the aspect ratio
    },
    title: {
        fontSize: '1.5rem',
        marginBottom: '1.5rem',
        color: '#333',
    },
    input: {
        width: '100%',
        padding: '0.75rem',
        margin: '0.5rem 0',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '1rem',
    },
    button: {
        width: '100%',
        padding: '0.75rem',
        backgroundColor: '#28a745', // Green color for the button
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    }
};

export default ResetPassword;
