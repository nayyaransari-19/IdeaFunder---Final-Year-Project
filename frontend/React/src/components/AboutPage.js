import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AboutPage.css";
import logo from '../assets/bcg.png';
import visionImage from '../assets/visionImage.png';
import Logo from '../assets/logo.png';
import { FaInfoCircle, FaLightbulb, FaUsers, FaSignInAlt, FaPhoneAlt, FaHome } from 'react-icons/fa';
const AboutPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);



  return (
    <div className="about-page">
      {/* Header */}
      <header className="about-header">
        <div className="about-logo">
          <img src={Logo} alt="Logo" className="about-header-logo" />
          IdeaFunder
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

      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-text">
          <h1>
            Our mission is to support academic projects in securing funding.
          </h1>
          <div className="about-hero-buttons">
            <button className="about-btn about-btn-green" onClick={() => navigate('/signin')}>Get Funds</button>
            <button className="about-btn about-btn-green" onClick={() => navigate('/how-it-works')}>Let’s Fund</button>
          </div>
        </div>
        <div className="about-hero-image-placeholder">
          <img src={logo} alt="Logo" />
        </div>
      </section>

      {/* Vision Section */}
      <section className="about-vision-section" style={{ background: `url(${visionImage}) no-repeat center/cover` }}>
        <div className="about-vision-background">
          <div className="about-vision-text">
            <h2>Our Vision</h2>
            <p>
              To be the leading platform that bridges academic innovation with
              investors, empowering groundbreaking projects to thrive and create
              a lasting impact on society.
            </p>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="about-info-section">
        <h2>Together, We can be successful</h2>
        <div className="about-info-columns">
          <div className="about-info-box">
            <h3>Who we are</h3>
            <p>
              We are an innovation-focused company aimed at assisting academic
              researchers and institutions secure funding for groundbreaking
              projects.
            </p>
          </div>
          <div className="about-info-box">
            <h3>How to help</h3>
            <p>
              Help us connect investors to support innovative ideas and research
              with social and scientific value.
            </p>
          </div>
          <div className="about-info-box">
            <h3>Where we work</h3>
            <p>
              From small projects to $1M+ ideas, we support academic innovators
              worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="about-footer">
        <div className="about-footer-contact">
          <h3>Stay Connected</h3>
          <p>
            Join our mailing list to get project updates and grow your academic
            funding journey.
          </p>
          <form className="about-contact-form">
            <input type="email" placeholder="Your email address" required />
            <textarea placeholder="Your message" rows="3" />
            <button className="about-footer-btn" type="submit">Submit</button>
            <button className="about-footer-btn about-footer-get-started" onClick={() => navigate('/signin')}>Get Started Now</button>
          </form>
        </div>

        

        <div className="about-footer-bottom">
          <p>2025 IdeaFunder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
