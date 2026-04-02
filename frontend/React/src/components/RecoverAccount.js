import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Import the logo
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

function RecoverAccount() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSendCode = async () => {
        if (!email) {
            toast.error("Please enter your email.");
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/forgot-password', { email });

            toast.success(response.data.message || "Reset code sent successfully!");
            
            setTimeout(() => {
                navigate('/verify-code', { state: { email } });
            }, 3000); // Redirect after 3 seconds
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send reset code.");
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

                <h2 style={styles.title}>Recover Account</h2>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                />
                <button onClick={handleSendCode} style={styles.button}>Send Code</button>
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

export default RecoverAccount;
