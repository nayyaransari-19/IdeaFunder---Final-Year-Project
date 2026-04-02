import React from "react";
import { useNavigate } from "react-router-dom";
import "./Comingsoon.css";

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div className="coming-soon">
      <div className="overlay">
        <h1 className="coming-title">🚧 Under Construction 🚧</h1>
        <p className="coming-text">This section is currently being built.</p>
        <p className="coming-subtext">Please check back later.</p>

        {/* Back to Admin Dashboard Button */}
        <button className="back-button" onClick={() => navigate("/admin")}>
          ← Back to Admin Dashboard
        </button>
      </div>
    </div>
  );
};

export default ComingSoon;
