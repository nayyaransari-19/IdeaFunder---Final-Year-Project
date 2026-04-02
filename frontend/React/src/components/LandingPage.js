import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import heroImage from '../assets/main.jpg';
import project1Image from '../assets/project1.jpg';
import project2Image from '../assets/project2.jpg';
import project3Image from '../assets/project3.jpg';
import '../index.css'; // Import the new CSS file
import charachterland from '../assets/charachterland.png';
import idealogo from '../assets/idealogo.png';
import { FaInfoCircle, FaLightbulb, FaUsers, FaSignInAlt, FaPhoneAlt } from 'react-icons/fa';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <header className="header">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-image" />
          <h1 className="logo-text">Idea Funder</h1>
        </div>

<nav className={`about-nav-menu `}>
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

      <main>
      <section className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
  <h1 className="title">Fund Your Ideas</h1>
  <p className="title">Empowering Academic Innovation through Collaborative Funding.</p>
  <button className="get-started-button" onClick={() => navigate('/signin')}>
    Get Started
  </button>
</section>

        <section className="share-idea">
  <h2>Share Your Idea</h2>
  <p>
    Have a great idea? Share it with our community, and let's make it a reality together. Our platform is ready to support you.
  </p>
  <button className="send-project-btn">Send Project</button>
</section>

        <section className="section">
          <h1>Funded Projects</h1>
          <div className="projects">
            <div className="project">
              <img className="project-image" src={project1Image} alt="Project 1" />
              <h3>Project 1</h3>
              <p>Dec 22, 2024</p>
            </div>
            <div className="project">
              <img className="project-image" src={project2Image} alt="Project 2" />
              <h3>Project 2</h3>
              <p>Nov 20, 2024</p>
            </div>
            <div className="project">
              <img className="project-image" src={project3Image} alt="Project 3" />
              <h3>Project 3</h3>
              <p>Nov 12, 2024</p>
            </div>
          </div>
        </section>

        <section class="testimonial">
  <div class="testimonial-container">
    <div class="testimonial-image-container">
      <img class="testimonial-image" src={charachterland} alt="testimonial" />
    </div>
    <div class="testimonial-text">
      <p>"Idea Funder turned my concept into reality with incredible ease and support!"</p>
      <h4>Emily Carter</h4>
      <span>Startup Founder</span>
    </div>
  </div>
</section>



        <section className="section pre-footer">
          <h2 className='green'>Ready to get started?</h2>
          <p>
            Join Idea Funder today and bring your innovative ideas to life. Let's turn your vision into reality.
          </p>
          <button className="get-started-button"  onClick={() => navigate('/signin')} >Get Started</button>
        </section>
      </main>

      <footer className="footer">
  <div className="footer-logo">
    <img className="footer-logo-image" src={idealogo} alt="Logo" />
  </div>
  
  <form className="newsletter">
    <label>Subscribe to our newsletter</label>
    <input className="input" type="email" placeholder="Enter your email" />
    <button className="subscribe-button">Subscribe</button>
  </form>
  
  <div className="footer-links">
    <a className="footer-link" href="#">Privacy</a>
    <a className="footer-link" href="#">Terms</a>
    <a className="footer-link" href="#">Sitemap</a>
  </div>
  <span>© 2024 Idea Funder. </span>
</footer>
    </div>
  );
};

export default LandingPage;
