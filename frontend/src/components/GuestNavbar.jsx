import { Link } from "react-router-dom";

const GuestNavbar = () => {
  const handleGoogleLogin = () => {
    const apiUrl =
      process.env.REACT_APP_API_BASE_URL || "http://localhost:3000"; // Fallback if the env var isn't set
    window.location.href = `${apiUrl}/auth/google`;
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
