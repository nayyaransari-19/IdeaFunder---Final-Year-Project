import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./TestimonialsPage.css"; // Ensure this is correctly imported
import logo from '../assets/logo.png';
import {
  FaInfoCircle,
  FaUsers,
  FaSignInAlt,
  FaPhoneAlt,
  FaHome,
} from "react-icons/fa";

function TestimonialsPage() {
  const navigate = useNavigate();

  // State to store testimonials and form data
  const [testimonials, setTestimonials] = useState([]);
  const [formData, setFormData] = useState({
    user_id: "",
    first_name: "",
    last_name: "",
    comment: "",
  });

  // Fetch testimonials from the backend
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/testimonials"
      );
      setTestimonials(response.data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/testimonials", formData);
      setFormData({ user_id: "", first_name: "", last_name: "", comment: "" });
      fetchTestimonials(); // Refresh the testimonials list
    } catch (error) {
      console.error("Error submitting testimonial:", error);
    }
  };

  return (
    <div className="testimonials-page">
      
      {/* Navigation */}
      <header className="header">
              <div className="test-logo-container">
                <img src={logo} alt="Logo" className="test-logo-image" />
                <h1 className="test-logo-text">Idea Funder</h1>
              </div>
      
      <nav className={`about-nav-menu `}>
      <button className="about-nav-button" onClick={() => navigate('/')}>
  <FaHome /> Home
</button>
      <button className="about-nav-button" onClick={() => navigate('/about')}>
      <FaInfoCircle />About Us</button>
      <button className="about-nav-button" onClick={() => navigate('/testimonials')}>
                <FaUsers />Testimonials</button>
                <button className="about-nav-button" onClick={() => navigate('/contact')}>
      <FaPhoneAlt />  Contact Us</button>
              
                
                <button className="about-contact-button" onClick={() => navigate('/signin')}>
                <FaSignInAlt /> Signup/Login  </button>
      
        
            
                
              </nav>
      
            </header>

      {/* Page Title */}
      <h1 className="testimonials-title">Testimonials</h1>

      {/* Form to submit a new testimonial */}
      <div className="testimonials-form">
        <h2>Add Your Testimonial</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="user_id"
            placeholder="User ID"
            value={formData.user_id}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
          <textarea
            name="comment"
            placeholder="Write your review..."
            value={formData.comment}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit" className="testimonials-submit-btn">Submit Review</button>
        </form>
      </div>

      {/* Display submitted testimonials */}
      <div className="testimonials-list">
        {testimonials.length === 0 ? (
          <p>No testimonials yet. Be the first to add yours!</p>
        ) : (
          testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-item">
              <h4>
                {testimonial.first_name} {testimonial.last_name}
              </h4>
              <p>{testimonial.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TestimonialsPage;
