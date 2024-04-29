/**
Author: Elijah Carter, Shivam Shelar, Joshua Chase
Date: 4/26/2024
Last Modified: 4/27/2024
Objective: Setup basic API connection and request for creditcraft

How to run:
- Navigate to location of the react src code in local machine
- run the following command: npm start
- npm start will launch App.js which will then navigate to this page


Elijah changes 4/27/2024:
- Connection Testing: verified that the handleSubmit function actually connects to the API

- Login Testing: verified that the forum does require the user to enter both fields
- Login Testing: verified that the API does check if the entered username/email and password exist in the table
		- Works correct, displays an alert when the user enters incorrect login credentials
		- Also logs in the browser console when the users entere correct or incorrect credentials

- Registration Testing: verified that the forum does require the user to enter all fields
- Registration Testing: does redirect the user to login screen after registration
- Registration Testing: verified that the the API does check for all required fields
		- Does check if passwords match
		- Does autoincremenet primary key
		
To Do:
- Redirect or navigate to the dashboard after successful login

*/

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  // State variables for Login and Registration
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState(''); // Add state for name
  const [dob, setDob] = useState(''); // Add state for date of birth
  const [confirmPassword, setConfirmPassword] = useState(''); // Add state for confirm password
  const SESSION_TIMEOUT = 600000; // 600000ms = 10min

  // Error messages:
  const emptyFieldsMSG = 'Please provide username/email and password.';
  const userAuthenticatedMSG = 'Login verified';
  const userUnauthenticateMSG = 'Incorrect login credentials.';
  const unsuccessfulConnectionMSG = 'An error occurred. Please try again.';
  const passwordMismatchMSG = 'Passwords do not match.';
  const registrationSuccessMSG = 'Registration successful';
  const registrationFailureMSG = 'Registration failed. Please try again.';
  const sessionExpiredMSG = 'Session expired. Please login again.';
  
  // Function to handle successful login
  const handleLoginSuccess = (userID) => {
    sessionStorage.setItem('userID', userID); // Store userID in sessionStorage
    setTimeout(() => {
      // Clear sessionStorage and redirect to login page
      sessionStorage.clear();
      alert(sessionExpiredMSG);
      navigate('/');
    }, SESSION_TIMEOUT);
    navigate('/home');
  };

 // Function to handle login form submission
 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!usernameOrEmail || !password) {
    alert(emptyFieldsMSG);
    return;
  }

  try {
    const url = `http://127.0.0.1:5000/get_data?table_name=Authentication&usernameOrEmail=${usernameOrEmail}&password=${password}`;
    const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });

    if (response.ok) {
      const data = await response.json();
      console.log('Correct credentials received:', data);
      handleLoginSuccess(data.UserID); // Pass UserID to handleLoginSuccess to be stored in the session
    } else {
      alert('Incorrect login credentials.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert(unsuccessfulConnectionMSG);
  }
 };

 // Function to handle registration form submission
 const handleRegistrationSubmit = async (e) => {
  e.preventDefault();

  if (!name || !dob || (!email && !username) || !password || !confirmPassword) {
    alert(emptyFieldsMSG);
    return;
  }

  if (password !== confirmPassword) {
    alert(passwordMismatchMSG);
    return;
  }

  try {
    // Construct the request data based on the presence of email or username
    let requestData;
    if (email && username) {
      requestData = { name, dob, email, username, password };
    } else if (email) {
      requestData = { name, dob, email, password };
    } else {
      requestData = { name, dob, username, password };
    }

    // Send registration data to the server
    const url = 'http://127.0.0.1:5000/register';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (response.ok) {
      alert(registrationSuccessMSG);
      setIsLogin(true); // Switch back to login form after successful registration
    } else {
      alert(registrationFailureMSG);
    }
  } catch (error) { // Unsuccessful connection
    console.error('Error:', error);
    alert(unsuccessfulConnectionMSG);
  }
 };

 return (
  <div className="login-container">
    <h2>{isLogin ? 'Login' : 'Register'}</h2>
    <form onSubmit={isLogin ? handleSubmit : handleRegistrationSubmit} className="login-form">
      {!isLogin && (
        <>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Date of Birth:</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="form-control"
            />
          </div>
        </>
      )}
      {isLogin && (
        <>
          <div className="form-group">
            <label>Username or Email:</label>
            <input
              type="text"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
            />
          </div>
        </>
      )}
      <button type="submit" className="btn btn-primary">
        {isLogin ? 'Login' : 'Register'}
      </button>
    </form>
    <p>
      {isLogin ? "Don't have an account? " : 'Already have an account? '}
      <button onClick={() => setIsLogin(!isLogin)} className="btn btn-link">
        {isLogin ? 'Register here' : 'Login here'}
      </button>
    </p>
  </div>
 );
}

export default Login;
