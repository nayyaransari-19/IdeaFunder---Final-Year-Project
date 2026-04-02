import React, { useState } from 'react';

function HelpSupportForm() {
    const [formData, setFormData] = useState({
        user_id: '',
        role: 'student',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://127.0.0.1:8000/api/help-support/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        alert(result.message);
    };

    return (
        <div className="help-support-container">
            <h3>Submit Help Request</h3>
            <form onSubmit={handleSubmit}>
                <input type="text" name="user_id" placeholder="User ID" onChange={handleChange} required />
                <select name="role" onChange={handleChange}>
                    <option value="student">Student</option>
                    <option value="investor">Investor</option>
                </select>
                <input type="text" name="subject" placeholder="Subject" onChange={handleChange} required />
                <textarea name="message" placeholder="Describe your issue" onChange={handleChange} required></textarea>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default HelpSupportForm;
