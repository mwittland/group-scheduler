import { Link } from "react-router-dom";

const GuestNavbar = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          WhatDaysWork
        </Link>

        
          <button className="btn btn-outline-light" onClick={handleGoogleLogin}>
            Login
          </button>
      </div>
    </nav>
  );
};

export default GuestNavbar;
