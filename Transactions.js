import React from 'react';
import { Link } from 'react-router-dom';

function Transactions() {
  return (
    <div>
      <h2>Transactions</h2>
      <p>Please select an option:</p>
      <Link to="/transactions/add">
        <button>Add New Transaction</button>
      </Link>
      <br />
      <Link to="/transactions/view">
        <button>View Past Transactions</button>
      </Link>
    </div>
  );
}

export default Transactions;