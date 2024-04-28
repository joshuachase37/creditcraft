import React from 'react';
import { Navigate, Link } from 'react-router-dom';

function Home() {
  function handleLogout() {
    // Clear user session or state
    localStorage.removeItem('isLoggedIn');
    // Redirect to the login page
    return <Navigate to="/" />;
  }

  return (
    <div>
      <h2>Welcome to the CreditCraft</h2>
      <p>Please select an option:</p>
      <Link to="/features">
        <button>Use Features</button>
      </Link>
      <br />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Home;