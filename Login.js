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
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usernameOrEmail || !password) {
      alert('Please provide username/email and password.');
      return;
    }

    try {
      // Send login data to the server
      const url = `http://127.0.0.1:5000/get_data?table_name=Authentication&usernameOrEmail=${usernameOrEmail}&password=${password}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Correct credentials received:', data);
        alert('Login verified');
        
        // Redirect to the home page after successful login
        navigate('/home');
      } else {
        alert('Incorrect login credentials.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
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
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}

export default Login;
