import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Import the logo
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

function VerifyCode() {
    const [token, setToken] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';

    const handleVerifyCode = async () => {
        if (!token) {
            toast.error("Please enter the verification code.");
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/verify-reset-code', {
                email,
                token,
            });

            toast.success(response.data.message || "Code verified successfully!");
            
            setTimeout(() => {
                navigate('/reset-password', { state: { email, token } });
            }, 3000); // Redirect after 3 seconds
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to verify code.");
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

                <h2 style={styles.title}>Verify Code</h2>
                <p style={styles.emailInfo}>Code was sent to: {email}</p>
                <input
                    type="text"
                    placeholder="Enter the reset code"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    style={styles.input}
                />
                <button onClick={handleVerifyCode} style={styles.button}>Verify Code</button>
            </div>
        </div>
    );
}

// Inline Styles
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
    emailInfo: {
        fontSize: '1rem',
        marginBottom: '1.5rem',
        color: '#666',
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

export default VerifyCode;
