import React, { useState, useEffect } from 'react';
import './UserManagement.css';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify and ToastContainer

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        role: ''
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/users');
            if (!response.ok) {
                throw new Error('Failed to fetch users.');
            }
            const data = await response.json();
            setUsers(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
            toast.error('Error fetching users: ' + error.message); // Toastify error
        }
    };

    const handleDeleteUser = async (id) => {
        const toastId = toast.info(
            <div style={{ textAlign: "center" }}>
                <p>Are you sure you want to delete this user?</p>
                <button 
                    onClick={async () => {
                        try {
                            const response = await fetch(`http://127.0.0.1:8000/api/users/${id}`, {
                                method: 'DELETE',
                            });
                            if (!response.ok) {
                                throw new Error('Failed to delete user.');
                            }
                            toast.dismiss(toastId); // Dismiss the toast
                            toast.success('User deleted successfully!');
                            setUsers(users.filter(user => user.id !== id));
                        } catch (error) {
                            toast.dismiss(toastId); // Dismiss the toast
                            toast.error(`Error deleting user: ${error.message}`);
                        }
                    }} 
                    className="confirm-btn"
                    style={{
                        marginRight: "10px",
                        padding: "5px 10px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Confirm
                </button>
                <button 
                    onClick={() => toast.dismiss(toastId)} // Dismiss the toast on Cancel
                    className="cancel-btn"
                    style={{
                        padding: "5px 10px",
                        backgroundColor: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Cancel
                </button>
            </div>,
            { autoClose: false, closeButton: false }
        );
    };
    
    
    

    const handleEditUser = (user) => {
        setEditingUser(user.id);
        setFormData({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role
        });
    };

    const handleUpdateUser = async (id) => {
        // Validation check before updating
        if (!formData.first_name || !formData.last_name || !formData.email || !formData.role) {
            toast.error('Please fill out all fields before updating the user.');
            return; // Early return if validation fails
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error('Failed to update user.');
            }
            toast.success('User updated successfully'); // Success toast
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            toast.error('Error updating user: ' + error.message); // Toastify error
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (loading) return <p className="loading-message">Loading users...</p>;
    if (error) return <p className="error-message">{error}</p>;

    const handleBackToDashboard = () => {
        navigate('/admin'); // Replace with your admin dashboard route
    };

    return (
        <div className="user-management-container">
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

            <h3>User Management</h3>

            <ul className="user-list">
                {users.length === 0 ? (
                    <p>No users found.</p>
                ) : (
                    users.map((user) => (
                        <li key={user.id} className="user-card">
                            {editingUser === user.id ? (
                                <div className="edit-form">
                                    <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} />
                                    <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} />
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
                                    <select name="role" value={formData.role} onChange={handleInputChange}>
                                        <option value="Admin">Admin</option>
                                        <option value="Student/Faculty">Student/Faculty</option>
                                        <option value="Investor">Investor</option>
                                    </select>
                                    <button className="save-btn" onClick={() => handleUpdateUser(user.id)}>Save</button>
                                    <button className="cancel-btn" onClick={() => setEditingUser(null)}>Cancel</button>
                                </div>
                            ) : (
                                <div className="user-info">
                                    <h4>{user.first_name} {user.last_name}</h4>
                                    <p><strong>Email:</strong> {user.email}</p>
                                    <p><strong>Role:</strong> {user.role}</p>
                                </div>
                            )}
                            <div className="user-actions">
                                <button className="edit-btn" onClick={() => handleEditUser(user)}>Edit</button>
                                <button className="delete-btn" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                            </div>
                        </li>
                    ))
                )}
            </ul>
            <div className="back-button-container">
                <button onClick={handleBackToDashboard} className="back-button">
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}

export default UserManagement;
