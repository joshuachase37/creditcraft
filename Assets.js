import React from 'react';
import { Link } from 'react-router-dom';

function Assets() {
  return (
    <div>
      <h2>Assets</h2>
      <p>Please select an option:</p>
      <Link to="/assets/add">
        <button>Add New Asset</button>
      </Link>
      <br />
      <Link to="/assets/view">
        <button>View Existing Assets</button>
      </Link>
    </div>
  );
}

export default Assets;