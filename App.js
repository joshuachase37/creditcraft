import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import Login from './Login'; // Capitalize Login
import './App.css';

function App() {
  return (
    <Router> {/* Wrap your components with Router */}
      <div className="App">
        <header className="App-header">
          <Login /> {/* Corrected component name */}
        </header>
      </div>
    </Router>
  );
}

export default App;
