import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AboutPage from './components/AboutPage';
import HowItWorksPage from './components/HowItWorksPage';
import TestimonialsPage from './components/TestimonialsPage';
import ContactPage from './components/ContactPage';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import InvestorDashboard from './components/InvestorDashboard';
import RecoverAccount from './components/RecoverAccount';
import VerifyCode from './components/VerifyCode';
import ResetPassword from './components/ResetPassword';
import SubmitProject from './components/SubmitProject';
import ProjectDetails from './components/ProjectDetails'; // Adjust the path if needed
import ViewProject from './components/ViewProject'; // Import the ViewProject component
import MyProjects from './components/MyProjects'; 
import EditProject from './components/EditProject'; // Import EditProject component
import BrowseProjects from './components/BrowseProjects';
import PaymentPage  from './components/PaymentPage';

import UserManagement from './components/UserManagement';
import ProjectManagement from './components/ProjectManagement';
import Settings from './components/Settings';
import Complaints from './components/Complaints';
import ApprovedProjects from './components/ApprovedProjects';
import AdminNotifications from './components/AdminNotifications';
import HelpSupportForm from './components/HelpSupportForm';
import Profile from './components/Profile';
import ProfilePreview from './components/ProfilePreview';
import Comingsoon from './components/Comingsoon';
import SwipeProjects from './components/SwipeProjects';


function App() {
    return (
        <Router>
            <Routes>
                {/* Landing Page */}
                <Route path="/" element={<LandingPage />} />

                {/* Pages */}
                <Route path="/about" element={<AboutPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/testimonials" element={<TestimonialsPage />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* Sign In and Sign Up */}
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />

                {/* Recover Password Flow */}
                <Route path="/recover-account" element={<RecoverAccount />} />
                <Route path="/verify-code" element={<VerifyCode />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Dashboards */}
                <Route path="/student" element={<StudentDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/investor" element={<InvestorDashboard />} />

                {/* Project Submission and Viewing */}
                <Route path="/student/submit-project" element={<SubmitProject />} />
                <Route path="/student/project-details/:id" element={<ViewProject />} />

                {/* Redirect any undefined paths */}
                <Route path="*" element={<Navigate to="/" />} />
                <Route path="/student/my-projects" element={<MyProjects />} />
                <Route path="/student/edit-project/:id" element={<EditProject />} />

                {/* Redirect browse project */}
                <Route path="/investor" element={<InvestorDashboard />} />
                <Route path="/investor/browse-all-projects" element={<BrowseProjects />} />
                <Route path="/investor/swipeup" element={<SwipeProjects />} />
                <Route path="/payment" element={<PaymentPage />} />

                {/* Redirect browse project */}
                <Route path="/student/profile" element={<Profile />} />
                <Route path="/student/profile-preview" element={<ProfilePreview />} />
                <Route path="/Comingsoon" element={<Comingsoon />} />
               
               
{/* Redirect admin dashboard pages */}
                
<Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/user-management" element={<UserManagement />} />
                <Route path="/admin/project-management" element={<ProjectManagement />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/admin/help-support" element={<HelpSupportForm />} />
                <Route path="/admin/complaints" element={<Complaints />} />
                <Route path="/admin/approved-projects" element={<ApprovedProjects />} />
                <Route path="/admin/notifications" element={<AdminNotifications />} />
                
              
                


            </Routes>
        </Router>

        
    );
}

export default App;

