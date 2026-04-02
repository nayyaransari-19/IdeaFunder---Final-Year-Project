import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import cash from '../assets/cash.jpg'; // Import the cash image
import logo from '../assets/logo.png'; // Import the logo image

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Please enter both email and password.");
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login', {
                email,
                password,
            });

            const role = response.data.role;
            const token = response.data.token;

            localStorage.setItem('email', email);
            localStorage.setItem('token', token);

            toast.success("Login successful! Redirecting...");

            setTimeout(() => {
                if (role === 'Admin') {
                    navigate('/admin');
                } else if (role === 'Student/Faculty') {
                    navigate('/student');
                } else if (role === 'Investor') {
                    navigate('/investor');
                } else {
                    toast.error("Unknown role.");
                }
            }, 0);

        } catch (error) {
            toast.error("Invalid email or password.");
            console.error(error.response?.data || error.message);
        }
    };

    const handleForgotPassword = () => {
        navigate('/recover-account');
    };

    return (
        <div style={styles.container}>
            <ToastContainer
    position="top-center" // Centered notifications
    autoClose={3000} // Closes after 3 seconds
    hideProgressBar={false}
    newestOnTop={true}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
/>

            {/* Left Section */}
            <div style={styles.left}>
                <div style={styles.leftOverlay}></div>
                <div style={styles.leftContent}>
                    <h1 style={styles.heading}>Idea Funder</h1>
                    <p style={styles.paragraph}>
                        Idea Funder is a dynamic platform connecting students, faculty, and investors
                        to fund transformative academic projects. Join us to bring your ideas to life.
                    </p>
                </div>
            </div>

            {/* Right Section */}
            <div style={styles.right}>
                <div style={styles.textContainer}>
                    <h1 style={styles.welcomeHeading}>Welcome</h1>
                    <p style={styles.welcomeText}>Let's get funded and bring your ideas to life!</p>
                </div>

                {/* Logo and Form */}
                <form onSubmit={handleSubmit} style={styles.formContainer}>
                    <div style={styles.logoContainer}>
                        <img src={logo} alt="Logo" style={styles.logo} />
                    </div>
                    <h2 style={styles.title}>Sign In</h2>
                    
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                    />
                    <button type="submit" style={styles.button}>Login</button>

                    <p>
                        Don't have an account?{' '}
                        <span onClick={() => navigate('/signup')} style={styles.link}>
                            Sign Up
                        </span>
                    </p>
                    <p>
                        Forgot your password?{' '}
                        <span onClick={handleForgotPassword} style={styles.link}>
                            Recover Account
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
}
// Inline Styles with Animations and Hover Effects
const styles = {
    container: {
        display: 'flex',
        width: '100%',
        height: '100vh',
        fontFamily: 'Arial, sans-serif',
        transition: 'all 0.3s ease-in-out',
    },
    left: {
        flex: 1,
        backgroundImage: `url(${cash})`,  // Cash image as background
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        transition: 'transform 0.5s ease',
    },
    leftOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark overlay
    },
    leftContent: {
        position: 'absolute',
        color: 'white',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        maxWidth: '80%',
    },
    heading: {
        fontSize: '2rem',
        marginBottom: '1rem',
        animation: 'fadeIn 1s ease-out',
    },
    paragraph: {
        fontSize: '1rem',
        lineHeight: '1.5',
        animation: 'fadeInUp 1s ease-out',
    },
    right: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',  // Arrange content vertically
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: '2rem',
        transition: 'transform 0.5s ease',
    },
    textContainer: {
        textAlign: 'center',
        marginBottom: '20px',  // Space between text and logo
        animation: 'fadeIn 1s ease-out',
    },
    welcomeHeading: {
        fontSize: '2rem',
        marginBottom: '0.5rem',
        color: '#333',
    },
    welcomeText: {
        fontSize: '1.5rem',
        marginBottom: '1.5rem',  // Space between text and logo
        color: '#555',
    },
    formContainer: {
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
    },
    logoContainer: {
        textAlign: 'center',  // Center the logo
        marginBottom: '20px',  // Space between logo and form
    },
    logo: {
        width: '100px',  // Set the size of the logo (adjust as needed)
        height: 'auto',  // Maintain the aspect ratio
        animation: 'fadeIn 1s ease-out',
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
        transition: 'border-color 0.3s ease',
    },
    button: {
        width: '100%',
        padding: '0.75rem',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'background-color 0.3s, transform 0.3s, box-shadow 0.3s',
    },
    buttonHover: {
        backgroundColor: '#218838',
        transform: 'scale(1.05)',
        boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
    },
    link: {
        color: '#007bff',
        cursor: 'pointer',
        textDecoration: 'none',
    },
};

// Keyframe Animations for smooth transitions
const animations = `
@keyframes fadeIn {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
}
@keyframes fadeInUp {
    0% { opacity: 0; transform: translateY(30px); }
    100% { opacity: 1; transform: translateY(0); }
}
`;

export default SignIn;
