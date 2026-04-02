import React, { useState } from "react";
import axios from "axios";
import logo from '../assets/logo.png'; // Import the logo image
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function SignUp() {
    const [role, setRole] = useState("");
    const [commonFields, setCommonFields] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [roleSpecificFields, setRoleSpecificFields] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Basic validation to prevent empty form submission
        if (!role || !commonFields.first_name || !commonFields.last_name || !commonFields.email || !commonFields.password || !commonFields.password_confirmation) {
            toast.error("All fields are required!");
            return;
        }
    
        if (commonFields.password !== commonFields.password_confirmation) {
            toast.error("Passwords do not match!");
            return;
        }
    
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/register", {
                role,
                ...commonFields,
                ...roleSpecificFields,
            });
    
            toast.success(response.data.message);
    
        } catch (error) {
            console.error("Error:", error);
    
            if (error.response && error.response.data.errors) {
                const validationErrors = error.response.data.errors;
    
                Object.keys(validationErrors).forEach((key) => {
                    toast.error(validationErrors[key][0]); // Show the first error for each field
                });
    
            } else {
                toast.error("An unknown error occurred. Please try again.");
            }
        }
    };

    return (
        
        <div

        
            style={{
                fontFamily: "'Poppins', sans-serif",
                backgroundColor: "#f8f9fa",
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",

                
            }}
        >
{/* Toastify Container for Notifications */}
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
        className="custom-toast-container"
    />
            
            <div
                style={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                    width: "100%",
                    maxWidth: "500px",
                    padding: "30px",
                }}
            >
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <img src={logo} alt="Idea Funder Logo" style={{ width: "150px", height: "auto" }} />
                </div>

                <h1
                    style={{
                        textAlign: "center",
                        color: "#4CAF50",
                        fontWeight: "bold",
                        marginBottom: "20px",
                    }}
                >
                    Idea Funder
                </h1>
                <form onSubmit={handleSubmit}>
                    {/* Role Selection */}
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ fontSize: "16px", color: "#555", fontWeight: "bold" }}>
                            Select Your Role:
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px",
                                fontSize: "16px",
                                borderRadius: "4px",
                                border: "1px solid #ddd",
                                marginTop: "10px",
                            }}
                        >
                            <option value="">Select Role</option>
                            <option value="Admin">Admin</option>
                            <option value="Student/Faculty">Student/Faculty</option>
                            <option value="Investor">Investor</option>
                        </select>
                    </div>

                    {/* Common Fields */}
                    <InputField
                        id="first_name"
                        label="First Name"
                        placeholder="Enter First Name"
                        value={commonFields.first_name}
                        onChange={(e) =>
                            setCommonFields({ ...commonFields, first_name: e.target.value })
                        }
                    />
                    <InputField
                        id="last_name"
                        label="Last Name"
                        placeholder="Enter Last Name"
                        value={commonFields.last_name}
                        onChange={(e) =>
                            setCommonFields({ ...commonFields, last_name: e.target.value })
                        }
                    />
                    <InputField
                        id="email"
                        label="Email"
                        type="email"
                        placeholder="Enter Email"
                        value={commonFields.email}
                        onChange={(e) =>
                            setCommonFields({ ...commonFields, email: e.target.value })
                        }
                    />
                    <InputField
                        id="password"
                        label="Password"
                        type="password"
                        placeholder="Enter Password"
                        value={commonFields.password}
                        onChange={(e) =>
                            setCommonFields({ ...commonFields, password: e.target.value })
                        }
                    />
                    <InputField
                        id="password_confirmation"
                        label="Confirm Password"
                        type="password"
                        placeholder="Confirm Password"
                        value={commonFields.password_confirmation}
                        onChange={(e) =>
                            setCommonFields({ ...commonFields, password_confirmation: e.target.value })
                        }
                    />

                    {/* Role-Specific Fields */}
                    {role === "Admin" && (
                        <InputField
                            id="admin_id"
                            label="Admin ID"
                            placeholder="Enter Admin ID"
                            value={roleSpecificFields.admin_id || ""}
                            onChange={(e) =>
                                setRoleSpecificFields({ ...roleSpecificFields, admin_id: e.target.value })
                            }
                        />
                    )}
                    {role === "Student/Faculty" && (
                        <>
                            <InputField
                                id="student_id"
                                label="Student ID"
                                placeholder="Enter Student ID"
                                value={roleSpecificFields.student_id || ""}
                                onChange={(e) =>
                                    setRoleSpecificFields({
                                        ...roleSpecificFields,
                                        student_id: e.target.value,
                                    })
                                }
                            />
                            {/* Program Dropdown */}
<select
    id="program"
    value={roleSpecificFields.program || ""}
    onChange={(e) =>
        setRoleSpecificFields({ ...roleSpecificFields, program: e.target.value })
    }
    placeholder="Select Program"
    style={{ width: "100%", padding: "0.75rem", margin: "0.5rem 0", border: "1px solid #ddd", borderRadius: "5px" }}
>
    <option value="">Select Program</option>
    <option value="BS Computer Science">BS Computer Science</option>
    <option value="BS Software Engineering">BS Software Engineering</option>
    <option value="BS Artificial Intelligence">BS Artificial Intelligence</option>
    <option value="BS Data Science">BS Data Science</option>
    <option value="BS Business Administration">BS Business Administration</option>
    <option value="BS Accounting and Finance">BS Accounting and Finance</option>
    <option value="BS Electrical Engineering">BS Electrical Engineering</option>
    <option value="BS Civil Engineering">BS Civil Engineering</option>
    <option value="MS Computer Science">MS Computer Science</option>
    <option value="MS Software Engineering">MS Software Engineering</option>
    <option value="MS Artificial Intelligence">MS Artificial Intelligence</option>
    <option value="MS Data Science">MS Data Science</option>
    <option value="MS Business Administration">MS Business Administration</option>
    </select>
                            <InputField
                                id="graduation_year"
                                label="Graduation Year"
                                type="number"
                                placeholder="Enter Graduation Year"
                                value={roleSpecificFields.graduation_year || ""}
                                onChange={(e) =>
                                    setRoleSpecificFields({
                                        ...roleSpecificFields,
                                        graduation_year: e.target.value,
                                    })
                                }
                            />
                            <div style={{ marginBottom: "20px" }}>
                                <label
                                    htmlFor="campus"
                                    style={{ fontSize: "16px", color: "#555", fontWeight: "bold" }}
                                >
                                    Campus:
                                </label>
                                <select
                                    id="campus"
                                    value={roleSpecificFields.campus || ""}
                                    onChange={(e) =>
                                        setRoleSpecificFields({ ...roleSpecificFields, campus: e.target.value })
                                    }
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        fontSize: "16px",
                                        borderRadius: "4px",
                                        border: "1px solid #ddd",
                                        marginTop: "10px",
                                    }}
                                >
                                    <option value="">Select Campus</option>
                                    <option value="SZABIST Gahro">SZABIST Gahro</option>
                                    <option value="SZABIST Clifton">SZABIST Clifton</option>
                                </select>
                            </div>
                        </>
                    )}
                    {role === "Investor" && (
                        <InputField
                            id="investor_id"
                            label="Investor ID"
                            placeholder="Enter Investor ID"
                            value={roleSpecificFields.investor_id || ""}
                            onChange={(e) =>
                                setRoleSpecificFields({
                                    ...roleSpecificFields,
                                    investor_id: e.target.value,
                                })
                            }
                        />
                    )}

                    <button
                        type="submit"
                        style={{
                            display: "block",
                            width: "100%",
                            padding: "12px",
                            backgroundColor: "#4CAF50",
                            color: "white",
                            fontSize: "18px",
                            fontWeight: "bold",
                            borderRadius: "4px",
                            border: "none",
                            cursor: "pointer",
                            marginTop: "20px",
                        }}
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}

// Reusable InputField Component
const InputField = ({ id, label, type = "text", placeholder, value, onChange }) => (
    <div style={{ marginBottom: "20px" }}>
        <label htmlFor={id} style={{ fontSize: "16px", color: "#555", fontWeight: "bold" }}>
            {label}:
        </label>
        <input
            type={type}
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            style={{
                width: "100%",
                padding: "10px",
                fontSize: "16px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                marginTop: "10px",
            }}
        />
    </div>
);

export default SignUp;
