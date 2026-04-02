import React from 'react';
import { useLocation } from 'react-router-dom';
import './PaymentPage.css';

function PaymentPage() {
    const location = useLocation();
    const project = location.state;

    return (
        <div className="payment-page-container">
            <h2>Fund Project</h2>
            <div className="project-details">
                <p><strong>Project Title:</strong> {project.title}</p>
                <p><strong>Proposed Budget:</strong> ${project.proposed_budget}</p>
            </div>

            <form className="payment-form">
                <label>
                    Your Name:
                    <input type="text" required />
                </label>
                <label>
                    Email:
                    <input type="email" required />
                </label>
                <label>
                    Amount to Fund:
                    <input type="number" required />
                </label>
                <button type="submit">Proceed to Payment</button>
            </form>
        </div>
    );
}

export default PaymentPage;
