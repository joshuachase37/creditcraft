import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  function handleLogout() {
    // Clear user session or state
    localStorage.removeItem('isLoggedIn');
    // Redirect to the login page
    navigate('/');
  }

  return (
    <div>
      <h2>Welcome to the CreditCraft</h2>
      <p>Please select an option:</p>
      <Link to="/features">
        <button>Use Features</button>
      </Link>
      <br />
      <Link to="/user-info">
        <button>View User Info</button>
      </Link>
      <br />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Home;
